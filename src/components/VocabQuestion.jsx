import {
    Text,
    View,
    StyleSheet,
} from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
    page: {
        backgroundColor: "white",
        color: "black",
    },
    section: {
        margin: 10,
        padding: 10,
    },
    viewer: {
        width: window.innerWidth / 2,
        height: window.innerHeight / 2,
    },
    optionsContainer: {
        display: "flex",
        flexDirection: 'row',
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    optionsChild: {
        width: '48%',
        marginTop: '8px'
    }
});

// Create Document Component
function VocabQuestion({question, opt1, opt2, opt3, opt4}) {
    return (
        <View style={styles.section}>
            <Text>{question}</Text>
            <View style={styles.optionsContainer}>
                <Text style={styles.optionsChild}>(1) {opt1}</Text>
                <Text style={styles.optionsChild}>(2) {opt2}</Text>
                <Text style={styles.optionsChild}>(3) {opt3}</Text>
                <Text style={styles.optionsChild}>(4) {opt4}</Text>
            </View>
        </View>
    );
}
export default VocabQuestion;