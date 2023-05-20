/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    TouchableOpacity,
    FlatList,
    TextInput
} from 'react-native';
import {
    createTable,
    getMenuItems,
    saveMenuItems,
    deleteMenuItems,
    filterByQueryAndCategories,
} from '../database';
import Filters from '../Filters';
const API_URL = 'https://api.ylymbilim.com/capstone/capstone.json';
const sections = ['Starters', 'Mains', 'Desserts', 'Drinks'];
import { useUpdateEffect } from '../utils';
import { debounce } from 'lodash';

function Item({ data }): JSX.Element {
    // console.log("https://api.ylymbilim.com/capstone/img/" + data.image)
    return (
        <View style={styles.itemContainer}>
            <Text style={styles.itemTitleText}>{data.name}</Text>
            <View style={styles.itemInfoContainer}>
                <View style={styles.itemInfoText}>
                    <Text style={styles.itemDescriptionText}>{data.description}</Text>
                    <Text style={styles.itemPriceText}>${data.price}</Text>
                </View>
                <Image style={styles.itemPicture} source={{ uri: "https://api.ylymbilim.com/capstone/img/" + data.image }} />
            </View>
        </View>)
};

export default function Home({ navigation }): JSX.Element {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [searchBarText, setSearchBarText] = useState('');
    const [query, setQuery] = useState('');
    const [filterSelections, setFilterSelections] = useState(
        sections.map(() => false)
    );

    const fetchData = async () => {
        console.log("start fetch");
        try {
            const response = await fetch(API_URL);
            const json = await response.json();
            setLoading(false);
            console.log('fetch complete', json);
            return json.menu;
        } catch (error) {
            console.error(error);
        } finally {
            // console.log(flatMenu);
        }
    }

    useEffect(() => {
        (async () => {
            try {
                await createTable();
                // for testing
                // await deleteMenuItems();
                // console.log(typeof(await getMenuItems()));
                let menuItems = await getMenuItems();
                // menuItems.then((res)=>console.log(res).catch(error=>console.error(error)));
                if (!menuItems.length) {
                    menuItems = await fetchData();
                    // await deleteMenuItems();
                    saveMenuItems(menuItems);
                    // console.log('from fetch', menuItems, menuItems.length, !menuItems.length);
                }
                setData(menuItems);
                setLoading(false);
            } catch (e) {
                // Handle error
                console.error("use effect: " + e);
            }
        })();
    }, []);

    useUpdateEffect(() => {
        (async () => {
            // console.log(sections);
            const activeCategories = sections.filter((s, i) => {
                // If all filters are deselected, all categories are active
                if (filterSelections.every((item) => item === false)) {
                    return true;
                }
                return filterSelections[i];
            });
            try {
                const menuItems = await filterByQueryAndCategories(
                    query,
                    activeCategories.map((section) => section.toLowerCase())
                );
                console.log('useUpdateEffect', menuItems);
                setData(menuItems);
            } catch (e) {
                console.log('useUpdateEffect ' + e.message);
            }
        })();
    }, [filterSelections, query]);

    const handleFiltersChange = async (index) => {
        const arrayCopy = [...filterSelections];
        arrayCopy[index] = !filterSelections[index];
        setFilterSelections(arrayCopy);
        // console.log("filter index:", index, arrayCopy);
    };

    const lookup = useCallback((q) => {
        setQuery(q);
    }, []);

    const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);

    const handleSearchChange = (text) => {
        setQuery(text);
        debouncedLookup(text);
    };

    const logo = require("../assets/img/Logo.png");
    const heroImage = require("../assets/img/hero.jpg");
    // const json = require('../assets/capstone.json');
    // const menu = json.menu;
    return (
        <View style={styles.container}>
            <View style={styles.hero}>
                <Text style={styles.heroTitle}>Little Lemon</Text>
                <Text style={styles.heroSubTitle}>Chicago</Text>
                <View style={styles.heroInfo}>
                    <Text style={styles.heroInfoText}>We are a family owned Mediterranean restaurant focused on traditional recipes served with a modern twist</Text>
                    <Image source={heroImage} style={styles.heroImage} />
                </View>
                <View>
                    <Text style={styles.searchText}>Search</Text>
                    <TextInput style={styles.input} value={query} onChangeText={handleSearchChange}></TextInput>
                </View>
            </View>
            <View style={styles.midpanel}>
                <Text style={styles.textOrder}>ORDER FOR DELIVERY</Text>
                <Filters
                    selections={filterSelections}
                    onChange={handleFiltersChange}
                    sections={sections}
                />
                <View style={styles.borderDiv}></View>
            </View>
            {isLoading && <Text>Loading ...</Text>}
            <FlatList
                data={data}
                renderItem={({ item }) => <Item data={item} />}
                keyExtractor={item => item.name}
                style={styles.menuContainer}
                ItemSeparatorComponent={()=><View style={styles.borderDiv}></View>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'flex-start'
    },
    hero: {
        alignContent: 'center',
        backgroundColor: '#495e57',
        padding: 10,
    },
    midpanel: {
        alignItems: 'flex-start',
    },
    borderDiv: {
        borderBottomWidth: 1,
        borderBottomColor: '#BBBFBE',
        width: '95%',
        alignSelf: 'center',
        marginVertical: 10,
    },
    heroInfo: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    footer: {
        alignItems: 'flex-end',
        padding: 20,
    },
    categoriesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 0,
        borderColor: 'blue',
        width: '100%',
        paddingHorizontal: 10,
    },
    heroImage: {
        borderRadius: 10,
        width: 150,
        height: 150,
    },
    logo: {
        marginTop: 20,
        alignSelf: "center",
        width: 250,
        height: 60,

    },
    heroTitle: {
        color: '#f4ce14',
        fontSize: 54,
        fontFamily: 'Markazi Text',
        fontWeight: 'bold',
    },
    heroSubTitle: {
        color: '#ffffff',
        fontSize: 34,
        fontFamily: 'Markazi Text',
    },
    heroInfoText: {
        color: '#ffffff',
        width: '50%',
        fontFamily: 'Karla',
        fontWeight: 'normal',
        fontSize: 15,
        marginRight: 10,
        marginTop: 10,
    },
    textOrder: {
        margin: 10,
        fontSize: 20,
        fontWeight: "bold",
        color: '#000000',
    },
    label: {
        margin: 10,
        marginBottom: 5,
        fontSize: 15,
        color: '#495E57',
    },
    input: {
        borderWidth: 1,
        borderRadius: 10,
        margin: 10,
        marginTop: 5,
        fontSize: 15,
        width: '95%',
        color: '#495E57',
        padding: 10,
        backgroundColor: '#ffffff',
    },
    button: {
        borderRadius: 10,
        backgroundColor: '#EDEFEE',
        margin: 5,
        padding: 10,
    },
    buttonText: {
        color: '#495e57',
        fontSize: 15,
        alignSelf: 'center',
        fontWeight: 'bold',
    },
    menuContainer: {
        width: '100%',
        alignContent: 'center',
        marginLeft: 10,
    },
    itemContainer: {
        width: '95%',
        borderWidth: 0,
        borderColor: 'blue',
    },
    itemTitleText: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#495e57',
    },
    itemInfoContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignContent: 'space-between',
        justifyContent: 'space-between',
    },
    itemInfoText: {
        width: '70%',
    },
    itemDescriptionText: {
        color: '#495e57',
    },
    itemPriceText: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#495e57',
        marginTop: 10,
    },
    itemPicture: {
        width: 100,
        height: 100,
    },
    searchText: {
        color: '#ffffff',
    }
});