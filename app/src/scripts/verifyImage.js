




export const verifyFile = () => {

  const isImg = (file) => {
  
    if (file.type.includes("image")) {
      return true;
    } else {
      return false;
    }

  }


  return { isImg }

}
