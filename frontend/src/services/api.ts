export const fetchBlockchain = async () => {
  const res = await fetch("http://localhost:3001/chain");
  return res.json();
};
