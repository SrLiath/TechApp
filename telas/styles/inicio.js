import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
    detalheTicketButtonText: {
        color: 'white'
    },
    circle: {
        width: 15,
        height: 15,
        top: 3,
        marginRight: 4,
        borderRadius: 25,
        borderWidth: 1,
    },
    detalheTicketButton: {
        backgroundColor: 'green',
        borderRadius: 15,
        height: 40,
        width: 330,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        marginTop: 10
    },
    btnContainerADD: {
        backgroundColor: 'blue',
        borderRadius: 20,
        height: 40,
        width: 330,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end',
        marginBottom: 10,
        marginTop: 10
    },
    loadingText: {
        color: 'white',
    },
    table: {
        alignSelf: 'stretch',
        marginHorizontal: 10,
    },
    hr: {
        borderBottomColor: 'white',
        borderBottomWidth: 10,
        marginVertical: 15,
    },
    labelText: {
        fontWeight: 'bold',
        color: 'white',
    },
    detailBtn: {
        width: '40%',
        backgroundColor: 'blue',
        borderRadius: 20,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -40,
        marginBottom: 10,
        alignSelf: 'flex-end',
    },
    detailText: {
        color: 'white',
    },
    titulo: {
        fontSize: 15,
        backgroundColor: '#f8f9fa',
        padding: 10,
        borderRadius: 5,
        textAlignVertical: 'top',
        height: 'unset',
        width: '100%'
    },
    descricao: {
        color: 'black',
        fontSize: 18,
        backgroundColor: '#f8f9fa',
        padding: 10,
        borderRadius: 5,
        textAlignVertical: 'top',
        height: '50%',
        width: '100%'

    },

    line: {
        marginTop: 5,
        marginBottom: 7,
        height: 1,
        width: '100%',
        backgroundColor: 'white',
    },
    label: {
        alignSelf: 'flex-start',
        fontWeight: 'bold',
        color: 'white',
    },
    data: {
        marginLeft: 10,
        color: 'white',
    },
    container: {
        flex: 1,
        backgroundColor: "#1b1e23",
        alignItems: "center",
        justifyContent: "center",
    },
    maintext: {
        fontSize: 16,
        margin: 20,
        color: "white",
    },
    barcodebox: {
        alignItems: "center",
        justifyContent: "center",
        height: 300,
        width: 300,
        overflow: "hidden",
        borderRadius: 30,
        backgroundColor: "#1b1e23",
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        alignItems: "center",
        justifyContent: "center",
    },
    modalContent: {
        backgroundColor: "#1b1e23",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
        width: "95%",
        height: "95%",
    },
    closeButton: {
        position: "absolute",
        top: 10,
        right: 10,
    },
    listItem: {
        flexDirection: 'row',
        width: "100%",
        borderBottomWidth: 1,
        borderBottomColor: "white",
        paddingVertical: 10,
    },
    listItemText: {
        color: "white",
    },
    flatList: {
        width: "100%",
    },
    noItemsText: {
        color: "white",
        textAlign: "center",
    },
    gearIcon: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 1,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 5,
        alignSelf: 'stretch',
    },
})

