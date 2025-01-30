// se o typescript encrencar com os arquivos CSS, executar npm install --save-dev @types/css-modules

declare module '*.svg' {
    const content: string;
    export default content;
}

declare module '*.png' {
    const content: string;
    export default content;
}

declare module '*.jpg' {
    const content: string;
    export default content;
}

declare module '*.gif' {
    const content: string;
    export default content;
}
  