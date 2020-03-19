import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import ServicesScreen from './screens/ServicesScreen';
import ServiceDetailsScreen from './screens/ServiceDetailsScreen';


const ServicesStack = createStackNavigator()

const Nav = () => {
    return <NavigationContainer>
        <ServicesStack.Navigator>
            <ServicesStack.Screen name='Services' component={ ServicesScreen } />
            <ServicesStack.Screen name='Details' component={ ServiceDetailsScreen } />
        </ServicesStack.Navigator>
    </NavigationContainer>
}

export default Nav