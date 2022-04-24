# Rent-Wise

# Rent-Wise

### Installation

```cd Rent-Wise-main>```<br>
```yarn install``` => this will install all the dependencies needed for this project. <br>
```npx react-native eject ``` this will generate ```/android``` and ```/ios``` folder. <br>
In order to run the app in IOS, you need to ```cd ios``` and run ```pod install```

#### react-native-vector-icons

You need a few more commands to install link vector-icon with your project. <br>
For IOS: you need to execute:<br>
```pod 'RNVectorIcons', :path => '../node_modules/react-native-vector-icons'```
and edit ```Info.plist```

```shell
<key>UIAppFonts</key>
  <array>
    <string>AntDesign.ttf</string>
    <string>Entypo.ttf</string>
    <string>EvilIcons.ttf</string>
    <string>Feather.ttf</string>
    <string>FontAwesome.ttf</string>
    <string>FontAwesome5_Brands.ttf</string>
    <string>FontAwesome5_Regular.ttf</string>
    <string>FontAwesome5_Solid.ttf</string>
    <string>Foundation.ttf</string>
    <string>Ionicons.ttf</string>
    <string>MaterialIcons.ttf</string>
    <string>MaterialCommunityIcons.ttf</string>
    <string>SimpleLineIcons.ttf</string>
    <string>Octicons.ttf</string>
    <string>Zocial.ttf</string>
    <string>Fontisto.ttf</string>
  </array>
```

For Android:
You need to go to ```android/app/build.gradle``` and add ```apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"```
and re-run the project using ```yarn android```







### firebase note:
@react-native-firebase/storage oss

@react-native-firebase/database @react-native-firebase/firestore are all database
@react-native-firebase/firestore is the database that was owned by firebase Google