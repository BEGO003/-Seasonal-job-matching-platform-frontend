import { API_BASE_URL, apiFetch } from "./config";
import { handleResponse } from "./utils";

export interface Comment {
  id: number;
  jobId?: number;
  userId: number;
  userName?: string;
  comment: string;
  createdAt: string;
  replies?: Reply[];
}

export interface Reply {
  id: number;
  commentId?: number;
  userId: number;
  userName?: string;
  comment: string;
  createdAt: string;
  replies?: Reply[];
}

export const commentsApi = {
  /** Fetch all comments (with nested replies) for a job */
  getComments: async (jobId: number): Promise<Comment[]> => {
    const res = await apiFetch(`${API_BASE_URL}/jobs/${jobId}/comments`);
    const payload = await handleResponse<any>(res);
    const list = Array.isArray(payload) ? payload : payload?.data ?? [];
    return list;
  },

  /** Post a top-level comment on a job */
  addComment: async (jobId: number, comment: string): Promise<Comment> => {
    const res = await apiFetch(`${API_BASE_URL}/jobs/${jobId}/comments`, {
      method: "POST",
      body: JSON.stringify({ comment }),
    });
    const payload = await handleResponse<any>(res);
    return payload?.data ?? payload;
  },

  /** Post a reply to an existing comment */
  addReply: async (
    jobId: number,
    commentId: number,
    comment: string
  ): Promise<Reply> => {
    const res = await apiFetch(
      `${API_BASE_URL}/jobs/${jobId}/comments/${commentId}/replies`,
      {
        method: "POST",
        body: JSON.stringify({ comment }),
      }
    );
    const payload = await handleResponse<any>(res);
    return payload?.data ?? payload;
  },

  /** Delete a comment by ID */
  deleteComment: async (jobId: number, commentId: number): Promise<void> => {
    const res = await apiFetch(
      `${API_BASE_URL}/jobs/${jobId}/comments/${commentId}`,
      { method: "DELETE" }
    );
    if (!res.ok && res.status !== 204) {
      await handleResponse<any>(res); // triggers error
    }
  },
};
