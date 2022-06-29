function encodeQueryString(params) {  // 쿼리스트링 만드는 함수
  const keys = Object.keys(params);
  return keys.length
          ? "?" + keys.map(key =>
                      encodeURIComponent(key) + "=" +
                      encodeURIComponent(params[keys])
                  ).join("&")
          : "";
}