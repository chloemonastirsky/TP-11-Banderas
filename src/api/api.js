const FLAGS_API_URL = 'https://countriesnow.space/api/v0.1/countries/flag/images';
const CAPITALS_API_URL = 'https://countriesnow.space/api/v0.1/countries/capital';

export async function fetchCountriesWithFlags() {
  try {
    const response = await fetch(FLAGS_API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error al obtener países:', error);
    return [];
  }
}

export async function fetchCapitals() {
  try {
    const response = await fetch(CAPITALS_API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error al obtener capitales:', error);
    return [];
  }
}


