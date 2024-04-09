import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Alert = ({ visible, title, message, onClose }) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>
                    <TouchableOpacity onPress={onClose} style={styles.button}>
                        <Text style={styles.buttonText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        backgroundColor: '#111',
        borderRadius: 10,
        padding: 20,
        width: '80%',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#999'
    },
    message: {
        fontSize: 12,
        marginBottom: 20,
        textAlign: 'center',
        color: '#777',
        padding: 10
    },
    button: {
        backgroundColor: '#222',
        borderRadius: 5,
        paddingVertical: 10,
    },
    buttonText: {
        color: '#999',
        fontSize: 12,
        textAlign: 'center',
    },
});

export default Alert;
