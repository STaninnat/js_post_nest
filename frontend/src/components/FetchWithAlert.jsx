async function FetchWithAlert(url, options) {
  try {
    const response = await fetch(url, options);

    return response;
  } catch (error) {
    console.error("Fetch error: ", error);
    throw error;
  }
}

export default FetchWithAlert;
