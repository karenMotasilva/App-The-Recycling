// Src/Navigation/AuthStack.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../Screens/LoginScreen';
import { MainTabNavigator } from './TabNavigator'; 

const Stack = createNativeStackNavigator();

export const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="MainApp" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="MainApp" component={MainTabNavigator} />
    </Stack.Navigator>
  );
};