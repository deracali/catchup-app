import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { ActivityIndicator, BackHandler, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import FontLoading from '../components/fonts/FontLoading';



const AuthLoadingScreen = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
    </View>
);
const AuthenticatedStack = () => {
    const router = useRouter();
    const [showChatbot, setShowChatbot] = useState(false);

 
  // Handle back button press on Android
  useFocusEffect(
    useCallback(() => {
      const handleBackButton = () => {
        // Prevent back navigation to login/signup screens if the token is available
        const currentRoute = router.pathname;
        const protectedRoutes = ['/index', '/signup', '/docsignup', '/login', '/doclogin' ]; // Add other routes you want to protect
        if (protectedRoutes.includes(currentRoute)) {
          return true; // Prevent navigation to login/signup
        }
        router.back();
        return true; // Prevent default back action
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackButton
      );

      return () => backHandler.remove();
    }, [router])
  );

    return (
  <>
        <Stack initialRouteName="auth/role" screenOptions={{ headerShown: false }}>

      
      </Stack>
      


   </>
    );
  };
  
  const UnauthenticatedStack = () => (
    <Stack initialRouteName="auth/role" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="auth/role" options={{ headerShown: false }} />
     <Stack.Screen name="auth/login" options={{ headerShown: false }} />
     <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
     <Stack.Screen name="auth/teacherSignup" options={{ headerShown: false }} />
     <Stack.Screen name="auth/teacherLogin" options={{ headerShown: false }} />
     <Stack.Screen name="home/homescreen" options={{ headerShown: false }} />
     <Stack.Screen name="home/streakscreen" options={{ headerShown: false }} />
     <Stack.Screen name="home/mission" options={{ headerShown: false }} />
     <Stack.Screen name="home/userappointments" options={{ headerShown: false }} />
     <Stack.Screen name="home/profile" options={{ headerShown: false }} />
     <Stack.Screen name="course/offlinecoursedetails" options={{ headerShown: false }} />
     <Stack.Screen name="course/mycourse" options={{ headerShown: false }} />
     <Stack.Screen name="course/offlinecourse" options={{ headerShown: false }} />
     <Stack.Screen name="course/[id]" options={{ headerShown: false }} />
     <Stack.Screen name="course/lessoncomplete" options={{ headerShown: false }} />
     <Stack.Screen name="subscription/sub" options={{ headerShown: false }} />
     <Stack.Screen name="subscription/substatus" options={{ headerShown: false }} />
     <Stack.Screen name="quiz/quiz" options={{ headerShown: false }} />
     {/* <Stack.Screen name="quiz/quizdetails" options={{ headerShown: false }} /> */}
     <Stack.Screen name="quiz/[id]" options={{ headerShown: false }} />
     <Stack.Screen name="quiz/quizscore" options={{ headerShown: false }} />
     <Stack.Screen name="quiz/quizsystem" options={{ headerShown: false }} />
     <Stack.Screen name="quiz/leadersboard" options={{ headerShown: false }} />
     <Stack.Screen name="quiz/review" options={{ headerShown: false }} />
     <Stack.Screen name="teachers/teacherslist" options={{ headerShown: false }} />
     <Stack.Screen name="teachers/createLiveCourse" options={{ headerShown: false }} />
     <Stack.Screen name="teachers/[id]" options={{ headerShown: false }} />
     <Stack.Screen name="teachers/home" options={{ headerShown: false }} />
     <Stack.Screen name="teachers/teachers" options={{ headerShown: false }} />
     <Stack.Screen name="teachers/success" options={{ headerShown: false }} />
     <Stack.Screen name="teachers/teacherLivecourses" options={{ headerShown: false }} />
     <Stack.Screen name="teachers/bookingscreen" options={{ headerShown: false }} />
     <Stack.Screen name="help/help" options={{ headerShown: false }} />
     <Stack.Screen name="help/community" options={{ headerShown: false }} />
     <Stack.Screen name="help/terms" options={{ headerShown: false }} />
    </Stack>
    
  );



const Layout = () => {
    const { loading, isAuthenticated } = useAuth();

    if (loading) {
        return <AuthLoadingScreen />;
    }

    return (
        <FontLoading>
        {isAuthenticated ? <AuthenticatedStack /> : <UnauthenticatedStack />}
    </FontLoading>
    )
};

const App = () => (
  <AuthProvider>
        <Layout />
  </AuthProvider>
);

export default App;




