export const Task = () => {

    const properties = {
        title: "title",
        description: "description"
    }

    function getTitle() { console.log(properties.title); }
    function getDescription() { console.log(properties.description); }
    function setTitle(title) { properties.title = title; }
    function setDescription(description) { properties.description = description; }

    return {
        setTitle,
        setDescription,
        getTitle,
        getDescription
    };

};