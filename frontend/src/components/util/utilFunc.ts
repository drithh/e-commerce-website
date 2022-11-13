export const roundDecimal = (num: number) => Math.round(num * 100) / 100;

export const convertToCurrency = (num: number) => {
  return num.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
  });
};

export const convertToBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

export const getBase64 = (file: File, callback: (result: string) => void) => {
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    callback(reader.result as string);
  };
  reader.onerror = function (error) {
    console.log("Error: ", error);
  };
};
