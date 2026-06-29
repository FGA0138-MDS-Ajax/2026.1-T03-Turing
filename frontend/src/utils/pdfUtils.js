import api from '../services/api';

export async function gerarBlobUrlPdf(urlOriginal) {
  if (!urlOriginal) return null;

  let caminho;
  try {
    const url = new URL(urlOriginal);
    caminho = url.pathname.replace('/media/', '');
  } catch {
    caminho = urlOriginal.replace(/^.*\/media\//, '');
  }

  const response = await api.get(`/media-inline/${caminho}/`, {
    responseType: 'blob',
  });

  return URL.createObjectURL(response.data);
}