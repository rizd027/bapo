// src/services/cloudinary.ts

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';

export const isCloudinaryMock = !cloudName || !uploadPreset;

/**
 * Mengunggah file gambar ke Cloudinary (atau dikonversi ke Base64 lokal jika dalam mode mock)
 * @param file Objek File dari input type="file"
 */
export async function uploadImage(file: File): Promise<string> {
  if (isCloudinaryMock) {
    console.log("[Cloudinary Service] Running in Mock mode. Converting image to Base64...");
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Gagal mengonversi file gambar ke base64 string.'));
        }
      };
      reader.onerror = () => {
        reject(new Error('Gagal membaca berkas file gambar.'));
      };
      reader.readAsDataURL(file);
    });
  }

  // Cloudinary Production Upload Flow
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error('Gagal mengunggah foto bukti ke Cloudinary.');
  }

  const data = await response.json();
  return data.secure_url;
}
