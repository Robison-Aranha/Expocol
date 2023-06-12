export const useVerifyScrollBottom = () => {

    const verifyScrollBottom = (setFunction, id) => {

        document.querySelector("#" + id).addEventListener('scroll', function() { 
            
            if (Math.round(this.scrollTop + this.offsetHeight) == this.scrollHeight) {
                setFunction()
            } 
        }); 

    }


    return { verifyScrollBottom }

}