export const useVerifyScrollTop = () => {

    const verifyScrollTop = (setFunction, id) => {

        document.querySelector("#" + id).addEventListener('scroll', function() { 
            if (this.scrollTop == 0) {
                setFunction()
            } 
        }); 

    }

    return { verifyScrollTop }

}