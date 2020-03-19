import React, { useState } from 'react'
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Share, FlatList } from 'react-native'
import { Button, Rating, Divider } from 'react-native-elements'
import { Ionicons, MaterialCommunityIcons, MaterialIcons, SimpleLineIcons, Feather } from "@expo/vector-icons";

import Colors from '../constants/Colors';
import { useSelector } from 'react-redux';
import ServiceCard from '../components/ServiceCard';


const ServiceDetailsScreen = ({ route }) => {


    let onShare = async () => {
        try {
            const result = await Share.share({
                message: `Come and try this awesome service (${service.description})`,
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const [showTerms, setShowTerms] = useState(false)
    const { serviceId } = route.params
    const service = useSelector(state => state.services.services[serviceId])
    const serviceProvider = useSelector(state => state.users.users.find(user => user.id === service.serviceProvider))

    const fetchedServices = useSelector(state => {
        const convertedData = []
        for (let key in state.services.services) {
            convertedData.push({
                id: key,
                serviceProvider: state.services.services[key].serviceProvider,
                img: state.services.services[key].img,
                description: state.services.services[key].description,
                price: state.services.services[key].price,
                rating: state.services.services[key].rating,
                category: state.services.services[key].category,
                terms: state.services.services[key].terms,
                date: state.services.services[key].date
            })
        }
        return (convertedData.sort((a, b) =>
            a.id > b.id ? -1 : 1
        ))
    })

    return <ScrollView style={ styles.container }>
        <Image source={ { uri: service.img } } style={ styles.img } />
        <Button onPress={ onShare } containerStyle={ styles.share } buttonStyle={ styles.share } icon={ <Feather name='share-2' size={ 25 } color='white' /> } />
        <View style={ styles.margin }>
            <View style={ styles.details }>
                <Text style={ styles.description }>{ service.description }</Text>
                <Rating
                    readonly
                    startingValue={ Number(service.rating) }
                    imageSize={ 16 }
                    style={ styles.rating }
                    ratingBackgroundColor={ '#F5F5F5' } />
                <View style={ styles.space }>
                    <Text style={ styles.unit }>{ service.category }</Text>
                    <View style={ styles.priceContainer }>
                        <Text style={ styles.price }>{ service.price } EGP</Text>
                        <Text style={ styles.unit }> /Hour</Text>
                    </View>
                </View>
            </View>
            <View style={ styles.fullDetails }>
                <View style={ styles.row }>
                    <View style={ styles.profileImgContainer }>
                        <Image source={ { uri: serviceProvider.image } } style={ styles.profileImg } />
                    </View>
                    <Text style={ styles.username }>{ serviceProvider.name }</Text>
                </View>
                <View style={ styles.contact }>
                    <View style={ styles.row }>
                        <MaterialCommunityIcons name='email-outline' size={ 17 } style={ styles.icon } />
                        <Text>{ serviceProvider.email }</Text>
                    </View>
                    <View style={ styles.row }>
                        <MaterialIcons name='phone' size={ 17 } style={ styles.icon } />
                        <Text>{ serviceProvider.phoneNumber }</Text>
                    </View>
                    <View style={ styles.row }>
                        <SimpleLineIcons name='location-pin' size={ 17 } style={ styles.icon } />
                        <Text>{ serviceProvider.address }</Text>
                    </View>
                </View>
                <View style={ styles.row }>
                    <Text style={ styles.speak }>Speakes: </Text>
                    { serviceProvider.languages.map((lang, index) => {
                        return <View style={ styles.language } key={ index }>
                            <Text>{ lang }</Text>
                        </View>
                    }) }
                </View>
                <Button type='clear' title='MESSAGE PROVIDER' titleStyle={ { color: '#0BDDDD', fontWeight: 'bold' } } />
                <Divider style={ styles.divider } />
                <Text style={ styles.subHeader }>Description</Text>
                <Text>{ service.description }</Text>
                <Divider style={ styles.divider } />
                <Text style={ styles.subHeader }>Languages</Text>
                <View style={ styles.row }>
                    { serviceProvider.languages.map((lang, index) => {
                        return <View style={ styles.language } key={ index }>
                            <Text>{ lang }</Text>
                        </View>
                    }) }
                </View>
                <Divider style={ styles.divider } />
                <TouchableOpacity style={ styles.space } onPress={ () => setShowTerms(!showTerms) }>
                    <Text style={ styles.subHeader }>Terms & conditions</Text>
                    { !showTerms ? <Ionicons name='ios-arrow-down' size={ 22 } color='grey' /> : <Ionicons name='ios-arrow-up' size={ 22 } color='grey' /> }
                </TouchableOpacity>
                { showTerms && <Text>{ service.terms }</Text> }
                <Divider style={ styles.divider } />
                <Text style={ styles.subHeader }>Reviews</Text>
            </View>
        </View>
        <Text style={ { ...styles.other, ...styles.margin } }>OTHER SERVICES</Text>
        <FlatList
            data={ fetchedServices }
            keyExtractor={ item => item.id }
            horizontal
            showsHorizontalScrollIndicator={ false }
            renderItem={ ({ item }) => {
                return <TouchableOpacity style={ styles.otherServices } >
                    <ServiceCard
                        img={ item.img }
                        description={ item.description }
                        category={ item.category }
                        rating={ Number(item.rating) }
                        price={ item.price } />
                </TouchableOpacity>
            } } />

        <Button title='REQUEST SERVICE' buttonStyle={ styles.reqButton } titleStyle={ styles.reqTitle } />

    </ScrollView >
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    img: {
        height: 140
    },
    share: {
        position: 'absolute',
        backgroundColor: Colors.primary,
        opacity: 0.8,
        height: 50,
        width: 50,
        borderBottomRightRadius: 15
    },
    username: {
        fontSize: 16
    },
    margin: {
        marginVertical: 10,
        marginHorizontal: 15
    },
    rating: {
        alignSelf: 'flex-start',
        marginVertical: 5
    },
    icon: {
        marginRight: 8
    },
    contact: {
        marginVertical: 10
    },
    speak: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    details: {
        borderWidth: 1,
        borderColor: '#E0DFDF',
        borderRadius: 13,
        backgroundColor: '#F5F5F5',
        padding: 15,
    },
    profileImgContainer: {
        borderWidth: 0.5,
        borderRadius: 50,
        width: 30,
        height: 30,
        marginRight: 7,
        overflow: 'hidden'
    },
    profileImg: {
        height: '100%',
        width: '100%'
    },
    description: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5
    },
    space: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    priceContainer: {
        flexDirection: 'row'
    },
    price: {
        fontWeight: 'bold',
        fontSize: 16,
        color: Colors.primary
    },
    unit: {
        fontSize: 15,
        color: 'grey'
    },
    fullDetails: {
        marginVertical: 10,
        borderWidth: 0.5,
        borderRadius: 13,
        borderColor: 'grey',
        padding: 15
    },
    subHeader: {
        marginBottom: 10,
        fontWeight: 'bold',
        color: 'grey'
    },
    language: {
        borderWidth: 0.5,
        borderRadius: 50,
        borderColor: 'grey',
        paddingVertical: 3,
        paddingHorizontal: 10,
        margin: 5

    },
    divider: {
        marginVertical: 12
    },
    otherServices: {
        width: 280
    },
    other: {
        fontSize: 23,
        fontWeight: 'bold',
    },
    reqButton: {
        backgroundColor: Colors.primary,
        borderRadius: 25,
        height: 50,
        marginVertical: 20,
        marginHorizontal: 15
    },
    reqTitle: {
        color: 'black',
        fontWeight: 'bold'
    }
})

export default ServiceDetailsScreen