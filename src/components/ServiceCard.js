import React from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'
import { Card, Rating } from 'react-native-elements'
import Colors from '../constants/Colors'


const ServiceCard = props => {
    return <View style={ styles.container }>
        <Card
            image={ { uri: props.img } }>
            <View style={ styles.details }>
                <Text style={ styles.description }>{ props.description }</Text>
                <Text style={ styles.category }>{ props.category }</Text>
                <View style={ props.mainScreen && styles.footer }>
                    <Rating
                        style={ !props.mainScreen && styles.rating }
                        readonly
                        startingValue={ props.rating }
                        ratingCount={ 5 }
                        imageSize={ 18 } />
                    <View style={ styles.priceContainer }>
                        <Text style={ styles.price }>{ props.price } EGP</Text>
                        <Text style={ styles.unit }> /Hour</Text>
                    </View>
                </View>
            </View>
        </Card>
    </View>
}

const styles = StyleSheet.create({
    container: {
        height: 300
    },
    details: {
        margin: 5,
        height: 100,
        justifyContent: 'center'
    },
    description: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    category: {
        fontSize: 15,
        color: 'grey',
        marginVertical: 8
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    rating: {
        marginBottom: 5,
        alignSelf: 'flex-start'
    },
    priceContainer: {
        flexDirection: 'row'
    },
    price: {
        fontWeight: 'bold',
        color: Colors.primary
    },
    unit: {
        color: 'grey'
    }
})

export default ServiceCard