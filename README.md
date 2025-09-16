## Editar librería:

Todos los comandos son en el root de react-components excepto si se indica lo contrario

> clonar repo

```cmd
npm install
```

Linkamos la librería ($package) a un proyecto (para ver los cambios en directo)

```cmd
cd packages/$package
npm link
```

```cmd
npm link @df/$package
:: en el proyecto!!
```

Los cambios se actualizan en directo

Una vez terminado, aumentamos la versión de la librería en packages/$package/package.json version

```cmd
npm run clean
:: (en el root!) Para borrar la build antigua
npm run build
:: Para montar la build
npm run pack
:: Para crear el tarball
```

Por último, lo subimos de nuevo al repo

## Instalar librería

Descargar último tarball de cada paquete

```cmd
npm i path2tarball/df-$package.x.y.z.tgz
```
