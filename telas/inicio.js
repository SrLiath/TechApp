import React, { useState, useEffect } from "react"
import { Button, StyleSheet, Text, View, Modal, TouchableOpacity, Image, FlatList, ScrollView, TextInput } from "react-native"
import { BarCodeScanner } from "expo-barcode-scanner"
import { useNavigation } from '@react-navigation/native'
import { sendTicket, confirm } from '../controllers/Requests'
import { TicketModal } from './modal/ticketModal'
import Spinner from 'react-native-loading-spinner-overlay'
import { getData, saveData } from '../controllers/Krypto'
import Toast from 'react-native-simple-toast';
import { styles } from './styles/inicio'
import he from 'he'

export default function HomeScreen() {
    const navigation = useNavigation()
    const [hasPermission, setHasPermission] = useState(null)
    const [scanned, setScanned] = useState(false)
    const [text, setText] = useState("Ainda não escaneado")
    const [showMainModal, setShowMainModal] = useState(false)
    const [showItemModal, setShowItemModal] = useState(false)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [ticketModalVisible, setTicketModalVisible] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)
    const [tickets, setTickets] = useState([])
    const [textQr, setTextQr] = useState('')




    //modal detalhe e reutilização para submodais
    const [nome, setNome] = useState(null)
    const [loading, setLoading] = useState(false)
    const [serial, setSerial] = useState(null)
    const [titu, setTitu] = useState(null)
    const [desc, setDesc] = useState(null)
    const [data, setData] = useState([
        { id: "0", item: "Sem Tickets" },
    ])

    //Dados PCx
    const [Uid, setUid] = useState(null)
    const [contato, setContato] = useState(null)
    const [ram, setRam] = useState(null)
    const [tipoRam, setTipoRam] = useState(null)
    const [tipoHd, setTipoHd] = useState(null)
    const [fabricante, setFabricante] = useState(null)
    const [tipo, setTipo] = useState(null)
    const [modelo, setModelo] = useState(null)
    const [SO, setSO] = useState(null)
    const [loca, setLoca] = useState(null)
    const [processador, setProcessador] = useState(null)





    useEffect(() => {
        if (tickets.length > 0) {
            const ticketsData = tickets.map((ticket, index) => ({
                id: index,
                item: ticket.ticketId,
                title: ticket.titulo,
                status: ticket.status
            }));

            setData(ticketsData)
        } else {
            setData([{ id: "0", item: "Sem Tickets" }])
        }
    }, [tickets])

    useEffect(() => {
        askForCameraPermission()
    }, [])


    //////////////////////////////////////////////////////////
    //limbo
    /////////////////////////////////////////////////////////


    const handleGearIconClick = () => {
        // Config
        navigation.navigate('Config');
    };

    const askForCameraPermission = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === "granted");
    };

    const again = async (data) => {
        const lines = data.split('\n');
        const idIndex = lines.findIndex(line => line.startsWith('ID ='));
        const nomeIndex = lines.findIndex(line => line.startsWith('Nome do item ='));
        if (idIndex !== -1 && nomeIndex !== -1) {
            const id = lines[idIndex].split('=')[1].trim();
            const nome = lines[nomeIndex].split('=')[1].trim();
            setText(nome);
            setUid(id);
            try {
                const url = `https://suporte.techsize.com.br/apirest.php/search/Ticket?criteria[0][field]=1&criteria[0][searchtype]=contains&criteria[0][value]=/${nome}&order=DESC`;
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'App-Token': await getData('app_token'),
                        'Session-Token': await getData('session_token')
                    },
                });

                if (response.ok) {
                    const responseData = await response.json();
                    try {
                        const tickets = responseData.data.map((ticket, index) => ({
                            id: index,
                            ticketId: ticket["2"],
                            titulo: ticket["1"],
                            status: ticket["12"],
                        }));
                        setTickets(tickets);
                        console.log(tickets)
                    } catch {
                        setTickets([]);
                    }
                } else {
                    console.error('Failed to fetch data:', response.statusText);
                }
            } catch (error) {
                console.error('Error during API request:', error.message);
            }
            try {
                const url = `https://suporte.techsize.com.br/apirest.php/Computer/${id}/?expand_dropdowns=true&get_hateoas=false`;
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'App-Token': await getData('app_token'),
                        'Session-Token': await getData('session_token')
                    },
                });

                if (response.ok) {
                    const item = await response.json();
                    const nome = item.name;
                    const serial = item.serial;
                    const contato = item.contact;
                    const model = item.computermodels_id;
                    const fabric = item.manufacturers_id;
                    const type = item.computertypes_id;
                    const localizacao = item.locations_id;
                    setLoca(localizacao);
                    setTipo(type);
                    setFabricante(fabric);
                    setModelo(model)
                    setNome(nome);
                    setSerial(serial);
                    setContato(contato);

                } else {
                    console.error('Failed to fetch data:', response.statusText);
                }
            } catch (error) {
                console.error('Error during API request:', error.message);
            }

            setShowMainModal(true);

        } else {
            Toast.showWithGravity('QR code invalido', Toast.LONG, Toast.CENTER);
        }
    }
    const handleBarCodeScanned = async ({ type, data }) => {
        setLoading(true);
        setScanned(true);
        const lines = data.split('\n');
        const idIndex = lines.findIndex(line => line.startsWith('ID ='));
        const nomeIndex = lines.findIndex(line => line.startsWith('Nome do item ='));
        setTextQr(data)
        if (idIndex !== -1 && nomeIndex !== -1) {
            const id = lines[idIndex].split('=')[1].trim();
            const nome = lines[nomeIndex].split('=')[1].trim();
            setText(nome);
            setUid(id);
            try {
                const url = `https://suporte.techsize.com.br/apirest.php/search/Ticket?criteria[0][field]=1&criteria[0][searchtype]=contains&criteria[0][value]=/${nome}&order=DESC`;
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'App-Token': await getData('app_token'),
                        'Session-Token': await getData('session_token')
                    },
                });

                if (response.ok) {
                    const responseData = await response.json();
                    try {
                        const tickets = responseData.data.map((ticket, index) => ({
                            id: index,
                            ticketId: ticket["2"],
                            titulo: ticket["1"],
                            status: ticket["12"],
                        }));
                        setTickets(tickets);
                        console.log(tickets)
                    } catch {
                        setTickets([]);
                    }

                } else {
                    console.error('Failed to fetch data:', response.statusText);
                }
            } catch (error) {
                console.error('Error during API request:', error.message);
            }
            try {
                const url = `https://suporte.techsize.com.br/apirest.php/Computer/${id}/?expand_dropdowns=true&get_hateoas=false`;
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'App-Token': await getData('app_token'),
                        'Session-Token': await getData('session_token')
                    },
                });

                if (response.ok) {
                    const item = await response.json();
                    const nome = item.name;
                    const serial = item.serial;
                    const contato = item.contact;
                    const model = item.computermodels_id;
                    const fabric = item.manufacturers_id;
                    const type = item.computertypes_id;
                    const localizacao = item.locations_id;
                    setLoca(localizacao);
                    setTipo(type);
                    setFabricante(fabric);
                    setModelo(model)
                    setNome(nome);
                    setSerial(serial);
                    setContato(contato);

                } else {
                    console.error('Failed to fetch data:', response.statusText);
                }
            } catch (error) {
                console.error('Error during API request:', error.message);
            }
            setScanned(true);
            setShowMainModal(true);

        } else {
            Toast.showWithGravity('QR code invalido', Toast.LONG, Toast.CENTER);
        }
        setLoading(false);
    };

    const closeModal = () => {
        setShowMainModal(false);
        setScanned(false);
    };

    const detailComputer = async () => {
        setLoading(true);
        id = Uid
        try {
            const url = `https://suporte.techsize.com.br/apirest.php/Computer/${id}/Item_DeviceMemory/?expand_dropdowns=true&get_hateoas=false`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'App-Token': await getData('app_token'),
                    'Session-Token': await getData('session_token')
                },
            });

            if (response.ok) {
                const data = await response.json();

                if (data.length > 0) {
                    const firstItem = data[0];
                    setTipoRam(firstItem.devicememories_id);
                    setRam(firstItem.size / 1024);
                }

            } else {
                console.error('Failed to fetch data:', response.statusText);
            }
        } catch (error) {
            console.error('Error during API request:', error.message);
        }
        try {
            const url = `https://suporte.techsize.com.br/apirest.php/Computer/${id}/Item_DeviceHardDrive/?expand_dropdowns=true&get_hateoas=false`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'App-Token': await getData('app_token'),
                    'Session-Token': await getData('session_token')
                },
            });

            if (response.ok) {
                const data = await response.json();

                if (data.length > 0) {
                    const firstItem = data[0];
                    setTipoHd(firstItem.deviceharddrives_id);
                }
            }
        } catch (error) {
            console.error('Error during API request:', error.message);
        }


        try {
            const url = `https://suporte.techsize.com.br/apirest.php/Computer/${id}/Item_OperatingSystem/?expand_dropdowns=true&get_hateoas=false`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'App-Token': await getData('app_token'),
                    'Session-Token': await getData('session_token')
                },
            });

            if (response.ok) {
                const data = await response.json();

                if (data.length > 0) {
                    const firstItem = data[0];
                    setSO(firstItem.operatingsystems_id);
                }
            }
        } catch (error) {
            console.error('Error during API request:', error.message);
        }

        try {
            const url = `https://suporte.techsize.com.br/apirest.php/Computer/${id}/Item_DeviceProcessor/?expand_dropdowns=true&get_hateoas=false`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'App-Token': await getData('app_token'),
                    'Session-Token': await getData('session_token')
                },
            });

            if (response.ok) {
                const data = await response.json();

                if (data.length > 0) {
                    const firstItem = data[0];
                    setProcessador(firstItem.deviceprocessors_id);
                }
            }
        } catch (error) {
            console.error('Error during API request:', error.message);
        }
        setLoading(false);
        setShowDetailModal(true);

    }

    const closeDetailModal = () => {
        setShowDetailModal(false);
    }

    const closeItemModal = () => {
        again(textQr)
        setShowItemModal(false);
        setSelectedItem(null);
    };
    const CircleStatus = (status) => {
        switch (status) {
            case 1:
                return { cor: 'green', borda: 'none' };
            case 2:
                return { cor: 'white', borda: 'green' };
            case 3:
                return { cor: 'white', borda: 'blue' };
            case 4:
                return { cor: 'orange', borda: 'none' };
            case 5:
                return { cor: 'white', borda: 'black' };
            case 6:
                return { cor: 'black', borda: 'white' };

            default:
                return { cor: 'gray', borda: 'none' };

        }
    }
    const renderListItem = ({ item }) => {
        const { cor: circleColor, borda: borderColor } = CircleStatus(item.status);
        item.circleColor = circleColor;
        item.borderColor = borderColor;

        return (
            <TouchableOpacity style={styles.listItem} onPress={() => handleListItemPress(item)}>
                <View style={[styles.circle, { backgroundColor: item.circleColor, borderColor: item.borderColor }]}>
                </View>
                <Text style={styles.listItemText}>{item.item} {item.title}</Text>
            </TouchableOpacity>
        );
    };

    const confirmDetailTicket = async () => {
        await confirm(selectedItem?.item)
        await again(textQr)
        setShowItemModal(false)
    };

    const handleListItemPress = async (item) => {
        setSelectedItem(item);
        try {
            const url = `https://suporte.techsize.com.br/apirest.php/Ticket/${item.item}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'App-Token': await getData('app_token'),
                    'Session-Token': await getData('session_token')
                },
            });

            if (response.ok) {
                const responseData = await response.json();

                setTitu(responseData.name)
                const decodedContent = he.decode(responseData.content);
                const cleanedContent = decodedContent.replace(/<[^>]*>/g, '');
                setDesc(cleanedContent);
            } else {
                console.error('Failed to fetch data:', response.statusText);
            }
        } catch (error) {
            console.error('Error during API request:', error.message);
        }
        setShowItemModal(true);
    };

    const openTicketAdd = () => {
        setTicketModalVisible(true);
    }
    return (
        <View style={styles.container}>
            {/*
            
            Loading

            */}
            <Spinner
                visible={loading}
                textContent={'Carregando...'}
                textStyle={styles.loadingText}
                overlayColor={'rgba(0, 0, 0, 0.5)'}
            />

            {/* 
            
            Tela Principal
            
            */}
            <TouchableOpacity style={styles.gearIcon} onPress={handleGearIconClick}>
                <Image source={require('../assets/img/gear.png')} style={{ width: 30, height: 30 }} />
            </TouchableOpacity>
            {hasPermission && !scanned && (
                <View style={styles.barcodebox}>
                    <BarCodeScanner
                        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                        style={{ height: 400, width: 400 }}
                    />
                </View>
            )}

            <Text style={styles.maintext}>{text}</Text>
            {/* 
                            
            Primeiro modal de lista de tickets e detalhes 
                            
            */}
            <Modal transparent={true} animationType="slide" visible={showMainModal}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                            <Text style={{ color: "white", fontSize: 25 }}>X</Text>
                        </TouchableOpacity>

                        <View style={styles.table}>
                            <View style={styles.row}>
                                <View style={styles.column}>
                                    <View style={styles.label}>

                                        <Text style={styles.label}>Nome do computador:</Text>
                                        <Text style={styles.data}>{nome || "Sem dados"}</Text>
                                    </View>
                                </View>



                            </View>
                            <View style={styles.Detail}>
                                <TouchableOpacity style={styles.detailBtn} onPress={detailComputer}>
                                    <Text style={styles.detailText}>Detalhes</Text>
                                </TouchableOpacity>
                            </View>
                        </View>


                        <View style={styles.line} />
                        <Text style={{ color: "white" }}>Tickets</Text>
                        <View style={styles.line} />
                        <View>
                            <TouchableOpacity style={styles.btnContainerADD} onPress={openTicketAdd}>
                                <Text style={styles.detailText}>Adicionar Ticket</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.line} />
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
            {/*
                            
            Modal detalhes do PC 
                    
            */}

            <Modal transparent={true} animationType="fade" visible={showDetailModal}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.closeButton} onPress={closeDetailModal}>
                            <Text style={{ color: "white", fontSize: 25 }}>X</Text>
                        </TouchableOpacity>
                        <View style={styles.hr} />
                        <View style={styles.row}>
                            <Text style={styles.label}>Serial:</Text>
                            <Text style={styles.data}>{serial || "Sem dados"}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Sistema Operacional:</Text>
                            <Text style={styles.data}>{SO || "Sem dados"}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Uid:</Text>
                            <Text style={styles.data}>{Uid || "Sem dados"}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Ram:</Text>
                            <Text style={styles.data}>{ram + " GB" || "Sem dados"}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Tipo de ram:</Text>
                            <Text style={styles.data}>{tipoRam || "Sem dados"}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Tipo HD:</Text>
                            <Text style={styles.data}>{tipoHd || "Sem dados"}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Fabricante:</Text>
                            <Text style={styles.data}>{fabricante || "Sem dados"}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Tipo:</Text>
                            <Text style={styles.data}>{tipo || "Sem dados"}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Modelo:</Text>
                            <Text style={styles.data}>{modelo || "Sem dados"}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Localização:</Text>
                            <Text style={styles.data}>{loca || "Sem dados"}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Processador:</Text>
                            <Text style={styles.data}>{processador || "Sem dados"}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Contato:</Text>
                            <Text style={styles.data}>{contato || "Sem dados"}</Text>
                        </View>


                    </View>
                </View>
            </Modal>
            {/*
                            
            Modal detalhes do Ticket 
                    
            */}
            <Modal transparent={true} animationType="slide" visible={showItemModal}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.closeButton} onPress={closeItemModal}>
                            <Text style={{ color: "white", fontSize: 25 }}>X</Text>
                        </TouchableOpacity>
                        <Text style={{ color: "white" }}>Detalhes do Ticket: {selectedItem?.item}</Text>
                        <View style={styles.line} />

                        <Text style={styles.label}>Título:</Text>
                        <Text style={styles.titulo}>{titu || "Sem titulo"}</Text>
                        <View style={styles.line} />
                        <Text style={styles.label}>Descrição:</Text>
                        <ScrollView style={styles.descricao}>
                            <TextInput
                                style={styles.readOnlyTextArea}
                                multiline
                                editable={false}
                                value={desc || "Sem descrição"}
                            />
                        </ScrollView>
                        {selectedItem?.status < 5 && (
                            <TouchableOpacity style={styles.detalheTicketButton} onPress={confirmDetailTicket}>
                                <Text style={styles.detalheTicketButtonText}>Confirmar</Text>
                            </TouchableOpacity>
                        )}

                    </View>
                </View>
            </Modal>

            {/* 

            Modal de criar Ticket
    
            */}

            <TicketModal
                transparent={ticketModalVisible}
                visible={ticketModalVisible}
                onClose={() => {
                    setTicketModalVisible(false)
                    again(textQr)
                }}
                atualizar={again}
                textQr={textQr}
                nome={nome}
                sendTicket={sendTicket}
            />

        </View>
    )
}
