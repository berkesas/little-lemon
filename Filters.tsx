import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const Filters = ({ onChange, selections, sections }) => {
    return (
        <View style={styles.filtersContainer}>
            {sections.map((section, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => {
                        onChange(index);
                    }}
                    style={selections[index] ? styles.darkButton : styles.lightButton }>
                    <View>
                        <Text style={selections[index] ? styles.lightText : styles.darkText }>
                            {section}
                        </Text>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    filtersContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        justifyContent: 'space-evenly',
    },
    lightButton: {
        borderRadius: 10,
        backgroundColor: '#EDEFEE',
        margin: 5,
        padding: 10,
    },
    darkButton: {
        borderRadius: 10,
        backgroundColor: '#495e57',
        margin: 5,
        padding: 10,
    },
    darkText: {
        color: '#495e57',
        fontSize: 15,
        alignSelf: 'center',
        fontWeight: 'bold',
    },
    lightText: {
        color: '#EDEFEE',
        fontSize: 15,
        alignSelf: 'center',
        fontWeight: 'bold',
    },
});

export default Filters;