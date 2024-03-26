# Para fazer a build para o android no ionic siga os passos abaixo

## comandos
```

- ionic capacitor add android

- ionic capacitor copy android

- ionic capacitor sync android

- npx cap sync android

```

- downgrade the jdk version of gradle in android studios. Project opened, go to settings/Build, Execiution, Deployment/Build Tools/Gradle. Then, in the Grandle JDK use the 11 Oracle OpenJdk version 11.0.21


- change the compileSdkVersion to 31 and the targetSdkVersion to 30 in the variebles.gadle

# Não se esqueça !!

- sempre deve-se conferir a pasta res em app/res pois lá estão os arquivos com as imagens de inicialização do app(splash), por padrão é utilizado a logo do capacitor em todos os formatos !!

- Além disso sempre deve-se conferir se a logo está correta.

  - Para isso clique com o botão direito na pasta drawable, em seguida clique em new e então em image Asset. Aqui fica as configurações da logo do aplicativo 



