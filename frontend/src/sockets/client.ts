import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

export interface ServerToClientEvents {
  room_state: (data: unknown) => void;
  round_started: (data: unknown) => void;
  prompt_submitted: (data: unknown) => void;
  cut_vote_update: (data: unknown) => void;
  performance_cut: (data: unknown) => void;
  rating_phase_start: (data: unknown) => void;
  round_ended: (data: unknown) => void;
}

export interface ClientToServerEvents {
  auth: (payload: { token?: string; displayName?: string }, callback: (response: unknown) => void) => void;
  submit_prompt: (data: { roundId: string; text: string }) => void;
  vote_prompt: (data: { roundId: string; promptId: string }) => void;
  cast_cut_vote: (data: { roundId: string }) => void;
  submit_rating: (data: { roundId: string; rating: number }) => void;
}

export type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export function createSocket(): TypedSocket {
  return io(SOCKET_URL, {
    autoConnect: false,
    transports: ['websocket', 'polling'],
  });
}
