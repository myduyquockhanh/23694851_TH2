import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '@stores/authStore';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';

export type RootParamList = {
  Auth: undefined;
  Main: undefined;
};

const Root = createNativeStackNavigator<RootParamList>();

const RootNavigator: React.FC = () => {
  const token = useAuthStore((s) => s.token);

  return (
    <Root.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      {token ? (
        <Root.Screen name="Main" component={MainTabs} />
      ) : (
        <Root.Screen name="Auth" component={AuthStack} />
      )}
    </Root.Navigator>
  );
};

export default RootNavigator;
