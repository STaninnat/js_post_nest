async function FetchWithAlert(url, options, navigate = null) {
  try {
    let response = await fetch(url, options);

    if (response.status === 401 && navigate) {
      const refreshResponse = await fetch("/v1/user/refresh-key", {
        method: "POST",
        credentials: "include",
      });

      if (!refreshResponse.ok) {
        navigate("/");
        throw new Error("session expired, please log in again");
      }

      response = await fetch(url, options);
    }

    return response;
  } catch (error) {
    console.error("fetch error: ", error);
    throw error;
  }
}

export default FetchWithAlert;
