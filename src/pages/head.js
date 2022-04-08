import icon from "../assets/icons/favicon.svg";

const head = () => {

    const favIcon = document.createElement("link");
    favIcon.rel = "icon";
    favIcon.type = "image/x-icon";
    favIcon.href = icon;

    const head = document.getElementsByTagName("head")[0];
    head.appendChild(favIcon);

};

export default head;