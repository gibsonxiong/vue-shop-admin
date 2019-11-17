let components = [
    {
        componentName:'div',
        displayName:'div',
    },
    {
        componentName:'span',
        displayName:'span'
    },
    {
        componentName:'input',
        displayName:'input'
    },
];

components.forEach(component=> {
    component.isNative = true;
})

export default components;