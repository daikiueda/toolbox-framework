const useClipboard = () => {
  const { write, writeText } = navigator.clipboard;
  return {
    write,
    writeText,
  };
};

export default useClipboard;
