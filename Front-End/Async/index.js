function userDetail() {
  const detail = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("faizal");
    }, 2000);
  });
  return detail;
}

async function fetchData() {
  try {
    const Detail = await userDetail();
    console.log({ Detail });
    console.log("data fetched successfully");
  } catch (error) {
    console.log({ error });
  }
}
fetchData();
