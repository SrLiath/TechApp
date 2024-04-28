import React, { useState } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { getOwnId } from '../../controllers/Requests'


export const TicketModal = ({ transparent, onClose, sendTicket, nome, atualizar, textQr }) => {
  const [requesterFullName, setRequesterFullName] = useState('');
  const [titulo, setTitulo] = useState('');
  const [tituloChamado, setTituloChamado] = useState('');
  const [descricaoChamado, setDescricaoChamado] = useState('');


  const handleConfirm = async () => {

    const requestBody = {
      input: {
        requester_full_name: requesterFullName,
        name: `${titulo}/${nome}`,

        content: `${tituloChamado} <br> ${descricaoChamado} </br>`,
        _users_id_requester: await getOwnId(),
        priority: '3',
        impact: '3',
        status: '1',
        type: '1',
      }
    };

    // Enviar o ticket
    await sendTicket('https://suporte.techsize.com.br/apirest.php/Ticket/', requestBody);

    await atualizar(textQr)
    requesterFullName('')
    titulo('')
    tituloChamado('')
    descricaoChamado('')
    onClose();
  };

  return (
    <Modal transparent={transparent} visible={transparent} style={styles.modalContainer}>
      <View style={styles.container}>
        <ScrollView>

          <Text style={styles.label}>Nome Empresa:</Text>
          <TextInput
            style={styles.input}
            value={requesterFullName}
            onChangeText={text => setRequesterFullName(text)}
            placeholder="Digite o nome da empresa"
            placeholderTextColor="gray"
          />

          <Text style={styles.label}>Nome:</Text>
          <TextInput
            style={styles.input}
            value={tituloChamado}
            onChangeText={text => setTituloChamado(text)}
            placeholder="Digite o titulo do chamado"
            placeholderTextColor="gray"
          />

          <Text style={styles.label}>Titulo:</Text>
          <TextInput
            style={styles.input}
            value={titulo}
            onChangeText={text => setTitulo(text)}
            placeholder="Digite o nome da pessoa"
            placeholderTextColor="gray"
          />

          <Text style={styles.label}>Descrição :</Text>
          <TextInput
            style={styles.input}
            value={descricaoChamado}
            onChangeText={text => setDescricaoChamado(text)}
            placeholder="Digite a descrição do chamado"
            placeholderTextColor="gray"
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
          />

        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={onClose} style={styles.btn}>
            <Text style={styles.btnText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleConfirm} style={styles.btnConfirm}>
            <Text style={styles.btnText}>Confirmar</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>

  );
};

export const styles = StyleSheet.create({
  btnText: {
    color: 'white'
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1b1e23', // Cor de fundo (bege)
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    bottom: '2%',
    left: '5%',
    position: 'absolute'
  },
  btn: {
    flex: 1,
    backgroundColor: 'blue',
    borderRadius: 20,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  btnConfirm: {
    flex: 1,
    backgroundColor: 'green',
    borderRadius: 20,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  input: {
    backgroundColor: '#f5f5f5', // Cor de fundo (bege)
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    color: 'black', // Cor do texto
    fontSize: 16,
    width: '100%',
  },
  label: {
    color: 'white',
    marginBottom: 10
  }
});
export default TicketModal;