import React, { useState, useEffect, useReducer } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Slider, ActivityIndicator } from 'react-native'
import { SearchBar, Button, Input, Divider } from 'react-native-elements'
import Modal from "react-native-modal";
import { FontAwesome, Ionicons, EvilIcons } from "@expo/vector-icons";
import { useSelector, useDispatch } from 'react-redux';
import MultiSlider from '@ptomasroos/react-native-multi-slider'

import ServiceCard from '../components/ServiceCard'
import * as servicesActions from '../store/actions/servicesActions'
import * as usersActions from '../store/actions/usersActions'
import Colors from '../constants/Colors';

const TOP_RATED = 'top_rated'
const PRICE_HIGHEST = 'price_highest'
const PRICE_LOWEST = 'price_lowest'
const TOGGLE_VISIBLE = 'toggle_visible'
const UPDATE_VALUE = 'update_value'

const reducer = (state, action) => {
    switch (action.type) {
        case TOGGLE_VISIBLE:
            const updatedVisibalities = {
                ...state.isVisible,
                [action.id]: action.hide ? false : !state.isVisible[action.id]
            }
            return {
                ...state,
                isVisible: updatedVisibalities
            }
        case UPDATE_VALUE:
            const updatedValues = {
                ...state.values,
                [action.id]: action.value
            }
            return {
                ...state,
                values: updatedValues
            }
        default: return state
    }
}

const ServicesScreen = props => {

    const dispatch = useDispatch()

    const [services, setServices] = useState([])

    const [state, selfDispatch] = useReducer(reducer, {
        isVisible: {
            filter: false,
            sort: false,
            rating: false,
            priceRange: false,
            loading: false
        },
        values: {
            searchText: '',
            providerName: '',
            rating: 0,
            priceRange: [],
            priceBoundries: []
        }
    })


    useEffect(() => {
        selfDispatch({ type: TOGGLE_VISIBLE, id: 'loading' })
        dispatch(usersActions.fetchUsers())
        dispatch(servicesActions.fetchServices(callback))
        selfDispatch({ type: TOGGLE_VISIBLE, id: 'loading' })
    }, [dispatch])

    callback = (data) => {
        setServices(data)
    }
    const users = useSelector(state => state.users.users)

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

    const getPriceBoundries = () => {
        if (!state.values.priceRange[1]) {
            let prices = []
            prices[1] = fetchedServices.reduce((accumulator, currentValue) => {
                return Math.max(accumulator, currentValue.price);
            }, 0)
            prices[0] = fetchedServices.reduce((accumulator, currentValue) => {
                return Math.min(accumulator, currentValue.price);
            }, Infinity)

            selfDispatch({ type: UPDATE_VALUE, id: 'priceRange', value: prices })
            selfDispatch({ type: UPDATE_VALUE, id: 'priceBoundries', value: prices })
        }

    }


    const search = (searchKey) => {
        selfDispatch({ type: UPDATE_VALUE, id: 'searchText', value: searchKey })
        const searched = fetchedServices.filter(service => {
            const lowerCase = service.description.toLowerCase()
            try {
                return lowerCase.search(searchKey.toLowerCase()) >= 0
            } catch (error) {
                console.log(error.message)
            }
        })
        setServices(searched)
        return searched
    }

    const filter = (providerName, rating) => {
        let searched = search(state.values.searchText)
        const filteredProviders = users.find(user => user.name.toLowerCase() === providerName.toLowerCase())
        const filterdServices = searched.filter(service => {
            if (providerName && !filteredProviders) {
                return
            }
            let ratingFilter = service.rating >= rating
            let priceFilter = service.price >= state.values.priceRange[0] && service.price <= state.values.priceRange[1]
            return filteredProviders ? service.serviceProvider === filteredProviders.id && ratingFilter && priceFilter
                : ratingFilter && priceFilter
        })
        setServices(filterdServices)
    }

    const sortby = (sortKey) => {
        switch (sortKey) {
            case TOP_RATED:
                services.sort((a, b) => a.rating < b.rating)
                break
            case PRICE_HIGHEST:
                services.sort((a, b) => Number(a.price) > Number(b.price))
                break
            case PRICE_LOWEST:
                services.sort((a, b) => Number(a.price) < Number(b.price))
                break
            default: break
        }
        selfDispatch({ type: TOGGLE_VISIBLE, id: 'sort' })
    }
    const showFilterHandler = () => {
        getPriceBoundries()
        selfDispatch({ type: TOGGLE_VISIBLE, id: 'filter' })
    }
    const closeFilterHandler = () => {
        selfDispatch({ type: TOGGLE_VISIBLE, id: 'filter' })
        selfDispatch({ type: TOGGLE_VISIBLE, id: 'rating', hide: true })
        selfDispatch({ type: TOGGLE_VISIBLE, id: 'priceRange', hide: true })
    }
    const filterHandler = () => {
        filter(state.values.providerName, state.values.rating)
        closeFilterHandler()
    }
    const renderFilter = () => {
        return <Modal
            isVisible={ state.isVisible.filter }
            onBackdropPress={ closeFilterHandler }
            onBackButtonPress={ closeFilterHandler }
            useNativeDriver
        >
            <View style={ styles.content }>
                <View style={ styles.modalItem }>
                    <Text style={ styles.filterHeader }>Filter</Text>
                    <TouchableOpacity onPress={ closeFilterHandler }>
                        <EvilIcons name='close' size={ 25 } color='grey' />
                    </TouchableOpacity>
                </View>

                <Input placeholder='Service Provider Name' onChangeText={ (value) => selfDispatch({ type: UPDATE_VALUE, id: 'providerName', value }) } value={ state.values.providerName } />
                <Divider style={ styles.divider } />
                <TouchableOpacity onPress={ () => selfDispatch({ type: TOGGLE_VISIBLE, id: 'rating' }) } style={ styles.modalItem }>
                    <Text style={ styles.filterSubHeader }>Rating</Text>
                    <View style={ styles.row }>
                        { state.values.rating > 0 && <Text style={ styles.modalValues }>{ state.values.rating }+</Text> }
                        { !state.isVisible.rating ? <Ionicons name='ios-arrow-down' size={ 22 } /> : <Ionicons name='ios-arrow-up' size={ 22 } /> }
                    </View>
                </TouchableOpacity>
                { state.isVisible.rating && <Slider style={ styles.ratingSlider } value={ state.values.rating } minimumValue={ 0 } maximumValue={ 4 } onValueChange={ (value) => selfDispatch({ type: UPDATE_VALUE, id: 'rating', value }) } step={ 1 } minimumTrackTintColor={ Colors.primary } thumbTintColor={ Colors.primary } /> }
                <Divider style={ styles.divider } />
                <TouchableOpacity onPress={ () => selfDispatch({ type: TOGGLE_VISIBLE, id: 'priceRange' }) } style={ styles.modalItem }>
                    <Text style={ styles.filterSubHeader }>Price Range</Text>
                    <View style={ styles.row }>
                        <Text style={ styles.modalValues }>{ state.values.priceRange[0] } - { state.values.priceRange[1] } EGP</Text>

                        { !state.isVisible.priceRange ? <Ionicons name='ios-arrow-down' size={ 22 } /> : <Ionicons name='ios-arrow-up' size={ 22 } /> }
                    </View>
                </TouchableOpacity>
                { state.isVisible.priceRange && <MultiSlider min={ state.values.priceBoundries[0] } max={ state.values.priceBoundries[1] } values={ state.values.priceRange } step={ 1 } markerStyle={ { backgroundColor: Colors.primary } } selectedStyle={ { backgroundColor: Colors.primary } } sliderLength={ 245 } onValuesChangeFinish={ (value) => selfDispatch({ type: UPDATE_VALUE, id: 'priceRange', value }) } containerStyle={ styles.priceRangeSlider } /> }
                <Divider style={ styles.divider } />
                <Button type='clear' title='Filter' onPress={ filterHandler } titleStyle={ styles.filterSubmitButton } />
            </View>
        </Modal>
    }
    const renderSort = () => {
        return <Modal
            onBackdropPress={ () => selfDispatch({ type: TOGGLE_VISIBLE, id: 'sort' }) }
            onBackButtonPress={ () => selfDispatch({ type: TOGGLE_VISIBLE, id: 'sort' }) }
            isVisible={ state.isVisible.sort }
            useNativeDriver
        >
            <View style={ styles.content }>
                <View style={ styles.modalItem }>
                    <Text style={ styles.filterHeader }>Sort</Text>
                    <TouchableOpacity onPress={ () => selfDispatch({ type: TOGGLE_VISIBLE, id: 'sort' }) }>
                        <EvilIcons name='close' size={ 25 } color='grey' />
                    </TouchableOpacity>
                </View>
                <Button type='clear' title='Top rated' onPress={ () => sortby(TOP_RATED) } />
                <Divider />
                <Button type='clear' title='Price Highest' onPress={ () => sortby(PRICE_LOWEST) } />
                <Divider />

                <Button type='clear' title='Price Lowest' onPress={ () => sortby(PRICE_HIGHEST) } />
            </View>
        </Modal>
    }

    if (state.isVisible.loading) {
        return <ActivityIndicator size='large' style={ styles.loading } />
    }

    return <View style={ styles.container }>
        <FlatList data={ services }
            keyExtractor={ item => item.id }
            ListHeaderComponent={ <View>
                <SearchBar placeholder='Search' value={ state.values.searchText } onChangeText={ search } lightTheme inputContainerStyle={ styles.searchBar } containerStyle={ styles.searchBar } placeholderTextColor='black' inputStyle={ { color: 'black' } } />
                <View style={ styles.header }>
                    <Text style={ styles.count }>{ services.length } Services</Text>
                    <View style={ styles.row }>
                        <Button type='clear' title=' Filter' titleStyle={ styles.filter } icon={ <FontAwesome name='filter' size={ 18 } color='grey' /> } onPress={ showFilterHandler } />
                        <Text style={ styles.VDivider }>|</Text>
                        <Button type='clear' title=' Sort' titleStyle={ styles.sort } icon={ <FontAwesome name='sort' size={ 18 } color={ Colors.primary } /> } onPress={ () => selfDispatch({ type: TOGGLE_VISIBLE, id: 'sort' }) } />
                    </View>
                </View>
            </View> }
            ListFooterComponent={ <View /> }
            ListFooterComponentStyle={ { margin: 30 } }
            ListEmptyComponent={ <View style={ styles.emptyList }>
                <Text style={ styles.emptyListText }>No Services Found.</Text>
            </View>
            }
            renderItem={ ({ item }) => {
                return <TouchableOpacity onPress={ () => props.navigation.navigate('Details', { serviceId: item.id }) } >
                    <ServiceCard
                        img={ item.img }
                        description={ item.description }
                        category={ item.category }
                        rating={ Number(item.rating) }
                        price={ item.price }
                        mainScreen />
                </TouchableOpacity>
            } } />
        { renderFilter() }
        { renderSort() }
    </View>
}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    searchBar: {
        backgroundColor: Colors.primary,
    },
    content: {
        backgroundColor: 'white',
        padding: 22,
        justifyContent: 'center',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    filter: {
        color: 'grey'
    },
    sort: {
        color: Colors.primary
    },
    divider: {
        marginVertical: 25
    },
    modalItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    filterHeader: {
        fontSize: 19,
        fontWeight: 'bold',
        marginBottom: 15
    },
    filterSubHeader: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    filterSubmitButton: {
        color: Colors.primary,
        fontWeight: 'bold',
        fontSize: 17
    },
    modalValues: {
        color: 'grey',
        marginHorizontal: 10,
        fontSize: 15
    },
    ratingSlider: {
        marginTop: 20
    },
    priceRangeSlider: {
        alignItems: 'center',
        marginTop: 10
    },
    container: {
        backgroundColor: 'white',
        flex: 1
    },
    header: {
        flexDirection: 'row',
        marginHorizontal: 15,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    VDivider: {
        fontSize: 20,
        color: 'grey'
    },
    count: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'grey'
    },
    emptyList: {
        marginTop: 120,
        alignItems: 'center',
        justifyContent: 'center'
    },
    emptyListText: {
        fontSize: 20,
        color: 'grey'
    }
})

export default ServicesScreen