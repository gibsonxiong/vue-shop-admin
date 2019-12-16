let components = [
    {
        componentName:'div',
        displayName:'div',
        style:{
            // background:'#f00',
            height:'40px',
            border:'1px solid #f00'
        }
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