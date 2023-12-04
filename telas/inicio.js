import React, { useState, useEffect } from "react";
import { Button, StyleSheet, Text, View, Modal, TouchableOpacity, FlatList, Image } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useNavigation } from '@react-navigation/native';


export default function HomeScreen() {
    const navigation = useNavigation();
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [text, setText] = useState("Ainda não escaneado");
    const [showMainModal, setShowMainModal] = useState(false);
    const [showItemModal, setShowItemModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [data, setData] = useState([
        { id: "1", item: "Item 1" },
        { id: "2", item: "Item 2" },
        { id: "3", item: "Item 3" },
    ]);



    const handleGearIconClick = () => {
        // Config
        navigation.navigate('Config');
    };

    const askForCameraPermission = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === "granted");
    };

    useEffect(() => {
        askForCameraPermission();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        setText(data);
        setShowMainModal(true);
        console.log("Type: " + type + "\nData: " + data);
    };

    const closeModal = () => {
        setShowMainModal(false);
        setScanned(false);
    };

    const renderListItem = ({ item }) => (
        <TouchableOpacity style={styles.listItem} onPress={() => handleListItemPress(item)}>
            <Text style={styles.listItemText}>{item.item}</Text>
        </TouchableOpacity>
    );

    const handleListItemPress = (item) => {
        setSelectedItem(item);
        setShowItemModal(true);
    };

    const closeItemModal = () => {
        setShowItemModal(false);
        setSelectedItem(null);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.gearIcon} onPress={handleGearIconClick}>
                <Image source={require('../assets/img/gear.png')} style={{ width: 30, height: 30 }} />
            </TouchableOpacity>
            <View style={styles.barcodebox}>
                <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    style={{ height: 400, width: 400 }}
                />
            </View>
            <Text style={styles.maintext}>{text}</Text>

            {scanned && (
                <Button title={"Escanear Novamente?"} onPress={() => setScanned(false)} color="#1b1e23" />
            )}

            <Modal transparent={true} animationType="slide" visible={showMainModal}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                            <Text style={{ color: "white", fontSize: 25 }}>X</Text>
                        </TouchableOpacity>
                        <Text style={{ color: "white" }}>Conteúdo do Modal</Text>

                        {data.length > 0 ? (
                            <FlatList
                                data={data}
                                keyExtractor={(item) => item.id}
                                renderItem={renderListItem}
                                style={styles.flatList}
                            />
                        ) : (
                            <Text style={styles.noItemsText}>Sem itens</Text>
                        )}
                    </View>
                </View>
            </Modal>

            <Modal transparent={true} animationType="slide" visible={showItemModal}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.closeButton} onPress={closeItemModal}>
                            <Text style={{ color: "white", fontSize: 25 }}>X</Text>
                        </TouchableOpacity>
                        <Text style={{ color: "white" }}>Detalhes do Item: {selectedItem?.item}</Text>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
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
        width: "100%", // Definir a largura para 100%
        borderBottomWidth: 1,
        borderBottomColor: "white",
        paddingVertical: 10,
    },
    listItemText: {
        color: "white",
    },
    flatList: {
        width: "100%", // Definir a largura para 100%
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
    }
});
