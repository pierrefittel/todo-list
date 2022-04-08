import newElement from "../functions/newElement";

const home = () => {

    //Main composition
    const thread = newElement("div", "thread", "thread");

    const content = document.getElementById("content");
    content.appendChild(thread);

};

export default home;