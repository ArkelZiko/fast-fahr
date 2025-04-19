const API = process.env.REACT_APP_API_BASE;

export async function fetchBookmarks() {
  const res = await fetch(`${API}/bookmarks/list.php`, {
    credentials: 'include'
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.data;
}

export async function toggleBookmark(postId, isBookmarked) {
  const url = `${API}/bookmarks/${isBookmarked ? 'remove' : 'add'}.php`;
  const form = new FormData();
  form.append('post_id', postId);
  const res = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    body: form
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return !isBookmarked;
}