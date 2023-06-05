
export const useReognizeScroll = () => {

    const organizeScroll = () => {
        var objDiv = document.getElementById("scroll")
        objDiv.scrollTop = objDiv.scrollHeight;
    }


    return { organizeScroll }

}