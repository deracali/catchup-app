import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function TeacherFormScreen() {
  const router = useRouter(); 
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [designation, setDesignation] = useState('');
  const [about, setAbout] = useState('');
  const [address, setAddress] = useState('');
  const [profileImage, setProfileImage] = useState(null); // base64 string for profile image
  const [cv, setCV] = useState(null); // base64 string for CV

  // Function to pick a profile image and convert to Base64
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.4, // Lower for better compression
    });
  
    if (!result.canceled) {
      const asset = result.assets[0];
      const uri = asset.uri;
      const base64 = asset.base64;
  
      // Get file size using FileSystem
      const info = await FileSystem.getInfoAsync(uri, { size: true });
      const sizeInMB = info.size / (1024 * 1024); // Convert to MB
  
      if (sizeInMB > 2) {
        Alert.alert("File too large", "Please choose an image under 2MB.");
        return;
      }
  
      // Detect MIME type
      let mimeType = 'image/jpeg';
      if (uri.endsWith('.png')) mimeType = 'image/png';
      else if (uri.endsWith('.jpg') || uri.endsWith('.jpeg')) mimeType = 'image/jpeg';
      else if (uri.endsWith('.webp')) mimeType = 'image/webp';
  
      setProfileImage(`data:${mimeType};base64,${base64}`);
    }
  };
  
  
  // Function to pick a CV file (PDF or Word) and convert its content to Base64
  const pickCV = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ]
      });

      if (result.type === 'success') {
        // Read file content as Base64
        const fileBase64 = await FileSystem.readAsStringAsync(result.uri, { encoding: FileSystem.EncodingType.Base64 });

        // Choose the MIME type based on file extension
        let mimeType = '';
        if (result.name.toLowerCase().endsWith('.pdf')) {
          mimeType = 'application/pdf';
        } else if (result.name.toLowerCase().endsWith('.doc')) {
          mimeType = 'application/msword';
        } else if (result.name.toLowerCase().endsWith('.docx')) {
          mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        }
        // Create a Base64 data URI for the CV file
        setCV(`data:${mimeType};base64,${fileBase64}`);
      }
    } catch (err) {
      Alert.alert("Error", "Could not select file.");
      console.error(err);
    }
  };

  // Submit the data to your backend
  const handleSubmit = async () => {
    try {
      const response = await fetch('http://your-server.com/api/teacher-reviews/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          designation,
          about,
          address,
          profileImage, // already a Base64 string
          cv,           // already a Base64 string
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Teacher profile created!');
        router.push({
          pathname: '/component/successModal',
          params: { email: email },
        });
      } else {
        Alert.alert('Error', data.error || 'Something went wrong!');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong!');
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
         <TouchableOpacity onPress={() => router.back()} style={styles.goBack}>
              <Text style={styles.goBackText}>← Back</Text>
            </TouchableOpacity>
      <Text style={styles.title}>Add Teacher</Text>

      <Input label="Name" icon="person" value={name} onChangeText={setName} />
      <Input label="Email" icon="mail" value={email} onChangeText={setEmail} />
      <Input label="Password" icon="lock-closed" value={password} onChangeText={setPassword} secureTextEntry />
      <Input label="Phone" icon="call" value={phone} onChangeText={setPhone} />
      <Input label="Designation" icon="briefcase" value={designation} onChangeText={setDesignation} />
      <Input label="About" icon="information-circle" value={about} onChangeText={setAbout} />
      <Input label="Address" icon="home" value={address} onChangeText={setAddress} />

      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        <Ionicons name="image" size={20} color="#666" />
        <Text style={styles.imagePickerText}>Pick Profile Image</Text>
      </TouchableOpacity>

      {profileImage && (
        <Image source={{ uri: profileImage }} style={styles.imagePreview} />
      )}

      <TouchableOpacity style={styles.imagePicker} onPress={pickCV}>
        <Ionicons name="document-text" size={20} color="#666" />
        <Text style={styles.imagePickerText}>Pick CV (PDF/DOC/DOCX)</Text>
      </TouchableOpacity>

      {cv && (
        <Text style={styles.fileSelectedText}>CV file selected</Text>
      )}

      <Button title="Submit" onPress={handleSubmit} />
    </ScrollView>
  );
}

const Input = ({ label, icon, ...rest }) => (
  <View style={styles.inputContainer}>
    <Ionicons name={icon} size={20} color="#666" style={styles.icon} />
    <TextInput
      style={styles.input}
      placeholder={label}
      value={rest.value}
      onChangeText={rest.onChangeText}
      secureTextEntry={rest.secureTextEntry}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  goBack: {
    position: 'absolute',
    top: 20,
    left: 230,
    zIndex: 10,
    backgroundColor: '#eee',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  goBackText: {
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    marginBottom: 12,
    borderRadius: 6,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
  },
  icon: {
    marginRight: 8,
  },
  imagePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    

  },
  imagePickerText: {
    marginLeft: 6,
    color:'#1a73e8',
  },
  imagePreview: {
    width: '100%',
    height: 180,
    marginBottom: 16,
    borderRadius: 6,
 
  },
  fileSelectedText: {
    marginBottom: 12,
    fontStyle: 'italic',
    color: 'green',
  },
});
