const writeText = (text: string) => navigator.clipboard.writeText(text);

const useClipboard = () => {
  return {
    writeText,
  };
};

export default useClipboard;
