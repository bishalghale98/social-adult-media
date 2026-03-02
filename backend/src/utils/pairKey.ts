/**
 * Returns a sorted pair key to ensure consistent ordering.
 * Used for Friendship and Conversation pairs to prevent duplicates.
 */
export function pairKey(id1: string, id2: string): [string, string] {
    return id1 < id2 ? [id1, id2] : [id2, id1];
}
