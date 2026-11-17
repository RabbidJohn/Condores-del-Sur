import { AircraftId } from '../game/types';

export const CAMPAIGN_SAVE_FILENAME = 'condores_1982_campana.json';

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime?: string;
  size?: string;
  webViewLink?: string;
  trashed?: boolean;
}

export interface CampaignSavePayload {
  version: 1;
  savedAt: string;
  pilotCallsign: string;
  aircraftId: AircraftId;
  highScore: number;
  score: number;
  waveNumber: number;
  enemiesDefeated: number;
  shipsSunk: number;
  lives: number;
  cannonLevel: number;
  bombs: number;
  exocets: number;
}

export class DriveAuthExpiredError extends Error {
  constructor() {
    super('La sesión de Google Drive expiró. Inicia sesión nuevamente.');
    this.name = 'DriveAuthExpiredError';
  }
}

async function driveFetch(
  url: string,
  token: string,
  init: RequestInit = {}
): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(url, {
    ...init,
    headers,
  });

  if (response.status === 401) {
    throw new DriveAuthExpiredError();
  }

  if (!response.ok) {
    let message = `Error de Google Drive (${response.status})`;
    try {
      const errJson = (await response.json()) as { error?: { message?: string } };
      if (errJson?.error?.message) {
        message = errJson.error.message;
      }
    } catch {
      // Ignore parse errors
    }
    throw new Error(message);
  }

  return response;
}

export async function listDriveFiles(
  token: string,
  searchQuery = ''
): Promise<DriveFileItem[]> {
  const qParts = ['trashed = false'];
  const cleanSearch = searchQuery.trim().replace(/'/g, "\\'");
  if (cleanSearch) {
    qParts.push(`name contains '${cleanSearch}'`);
  }

  const params = new URLSearchParams({
    pageSize: '25',
    orderBy: 'modifiedTime desc',
    q: qParts.join(' and '),
    fields: 'files(id,name,mimeType,modifiedTime,size,webViewLink,trashed)',
  });

  const res = await driveFetch(
    `https://www.googleapis.com/drive/v3/files?${params.toString()}`,
    token
  );
  const data = (await res.json()) as { files?: DriveFileItem[] };
  return data.files ?? [];
}

export async function findCampaignSaveFile(token: string): Promise<DriveFileItem | null> {
  const params = new URLSearchParams({
    pageSize: '5',
    orderBy: 'modifiedTime desc',
    q: `name = '${CAMPAIGN_SAVE_FILENAME}' and trashed = false`,
    fields: 'files(id,name,mimeType,modifiedTime,size,webViewLink)',
  });

  const res = await driveFetch(
    `https://www.googleapis.com/drive/v3/files?${params.toString()}`,
    token
  );
  const data = (await res.json()) as { files?: DriveFileItem[] };
  return data.files?.[0] ?? null;
}

export async function downloadDriveFileText(token: string, fileId: string): Promise<string> {
  const res = await driveFetch(
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?alt=media`,
    token
  );
  return res.text();
}

export async function downloadCampaignSave(
  token: string,
  fileId: string
): Promise<CampaignSavePayload> {
  const raw = await downloadDriveFileText(token, fileId);
  const parsed = JSON.parse(raw) as Partial<CampaignSavePayload>;
  if (typeof parsed.waveNumber !== 'number' || typeof parsed.aircraftId !== 'string') {
    throw new Error('El archivo seleccionado no contiene una partida válida de Cóndores del Sur.');
  }
  return {
    version: 1,
    savedAt: parsed.savedAt ?? new Date().toISOString(),
    pilotCallsign: parsed.pilotCallsign ?? 'HALCÓN 1',
    aircraftId: parsed.aircraftId as AircraftId,
    highScore: Number(parsed.highScore) || 0,
    score: Number(parsed.score) || 0,
    waveNumber: Math.min(20, Math.max(1, Number(parsed.waveNumber) || 1)),
    enemiesDefeated: Number(parsed.enemiesDefeated) || 0,
    shipsSunk: Number(parsed.shipsSunk) || 0,
    lives: Math.max(1, Number(parsed.lives) || 5),
    cannonLevel: Math.min(3, Math.max(1, Number(parsed.cannonLevel) || 1)),
    bombs: Math.max(0, Number(parsed.bombs) || 2),
    exocets: Math.max(0, Number(parsed.exocets) || 1),
  };
}

function buildMultipartBody(
  metadata: Record<string, unknown>,
  content: string,
  contentType: string
): { body: string; boundary: string } {
  const boundary = `condores_boundary_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const body =
    `--${boundary}\r\n` +
    `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
    `${JSON.stringify(metadata)}\r\n` +
    `--${boundary}\r\n` +
    `Content-Type: ${contentType}; charset=UTF-8\r\n\r\n` +
    `${content}\r\n` +
    `--${boundary}--`;
  return { body, boundary };
}

export async function saveCampaignToDrive(
  token: string,
  payload: CampaignSavePayload,
  existingFileId?: string | null
): Promise<DriveFileItem> {
  const metadata = existingFileId
    ? {
        name: CAMPAIGN_SAVE_FILENAME,
        mimeType: 'application/json',
        description: 'Partida guardada de Cóndores del Sur 1982',
      }
    : {
        name: CAMPAIGN_SAVE_FILENAME,
        mimeType: 'application/json',
        description: 'Partida guardada de Cóndores del Sur 1982',
      };

  const { body, boundary } = buildMultipartBody(
    metadata,
    JSON.stringify(payload, null, 2),
    'application/json'
  );

  const url = existingFileId
    ? `https://www.googleapis.com/upload/drive/v3/files/${encodeURIComponent(existingFileId)}?uploadType=multipart&fields=id,name,mimeType,modifiedTime,size,webViewLink`
    : 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,modifiedTime,size,webViewLink';

  const res = await driveFetch(url, token, {
    method: existingFileId ? 'PATCH' : 'POST',
    headers: {
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body,
  });

  return (await res.json()) as DriveFileItem;
}

export async function exportFlightLogToDrive(
  token: string,
  fileName: string,
  content: string
): Promise<DriveFileItem> {
  const { body, boundary } = buildMultipartBody(
    {
      name: fileName,
      mimeType: 'text/plain',
      description: 'Bitácora de vuelo - Cóndores del Sur 1982',
    },
    content,
    'text/plain'
  );

  const res = await driveFetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,modifiedTime,size,webViewLink',
    token,
    {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body,
    }
  );

  return (await res.json()) as DriveFileItem;
}

export async function renameDriveFile(
  token: string,
  fileId: string,
  newName: string
): Promise<DriveFileItem> {
  const res = await driveFetch(
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?fields=id,name,mimeType,modifiedTime,size,webViewLink`,
    token,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newName }),
    }
  );
  return (await res.json()) as DriveFileItem;
}

export async function trashDriveFile(token: string, fileId: string): Promise<void> {
  await driveFetch(
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}`,
    token,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ trashed: true }),
    }
  );
}

export async function deleteDriveFile(token: string, fileId: string): Promise<void> {
  await driveFetch(
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}`,
    token,
    {
      method: 'DELETE',
    }
  );
}
