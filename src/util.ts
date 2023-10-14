export const isEmpty = <T>(array: Array<T> | undefined | null): boolean =>
  !array || array.length === 0;

export const downloadFile = <T>(fileName: string, content: T) => {
  const encodedContent = JSON.stringify(content, null, 2);
  const blob = new Blob([encodedContent], {
    type: 'application/json;charset=utf-8',
  });

  const anchor = document.createElement('a');
  anchor.href = URL.createObjectURL(blob);
  anchor.download = fileName;
  anchor.click();

  setTimeout(() => URL.revokeObjectURL(anchor.href), 30_000);
};
