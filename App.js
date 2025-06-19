import * as React from 'react';
import { useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import DashboardScreen from './screens/DashboardScreen';
import CustomerDashboard from './screens/CustomerDashboard';
import TechnicianDashboard from './screens/TechnicianDashboard';
import TechnicianProfile from './screens/TechnicianProfile';
import CreateServiceRequest from './screens/CreateServiceRequest';
import BookingsScreen from './screens/BookingsScreen';
import OffersScreen from './screens/OffersScreen';
import ProfileScreen from './screens/ProfileScreen';
import SubscriptionScreen from './screens/SubscriptionScreen';
import RevenueAnalyticsScreen from './screens/RevenueAnalyticsScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { apiService } from './config/api';
import ErrorBoundary from './components/ErrorBoundary';
import { useTheme } from './useTheme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  const { colors } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') iconName = 'home';
          else if (route.name === 'Bookings') iconName = 'calendar';
          else if (route.name === 'Offers') iconName = 'tag';
          else if (route.name === 'Profile') iconName = 'account';
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.disabled,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: {
          fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.text.primary,
        }}
      />
      <Tab.Screen 
        name="Bookings" 
        component={BookingsScreen}
        options={{
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.text.primary,
        }}
      />
      <Tab.Screen 
        name="Offers" 
        component={OffersScreen}
        options={{
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.text.primary,
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.text.primary,
        }}
      />
    </Tab.Navigator>
  );
}

function App() {
  const colorScheme = useColorScheme();
  const { colors } = useTheme();

  const navigationTheme = {
    dark: colorScheme === 'dark',
    colors: {
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.text.primary,
      border: colors.border,
      notification: colors.accent,
    },
  };

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <NavigationContainer theme={navigationTheme}>
          <Stack.Navigator 
            initialRouteName="Login"
            screenOptions={{
              headerStyle: {
                backgroundColor: colors.surface,
              },
              headerTintColor: colors.text.primary,
              headerShadowVisible: false,
              contentStyle: {
                backgroundColor: colors.background,
              },
            }}
          >
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen} 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="CustomerDashboard" 
              component={CustomerDashboard} 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="TechnicianDashboard" 
              component={TechnicianDashboard} 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="TechnicianProfile" 
              component={TechnicianProfile} 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="CreateServiceRequest" 
              component={CreateServiceRequest} 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Subscription" 
              component={SubscriptionScreen} 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="RevenueAnalytics" 
              component={RevenueAnalyticsScreen} 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Main" 
              component={TabNavigator} 
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

export default App; 