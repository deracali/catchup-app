import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  StatusBar,
  Linking,
  Platform,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';


export default function TeacherFormScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [designation, setDesignation] = useState('');
  const [about, setAbout] = useState('');
  const [address, setAddress] = useState('');
  const [profileImage, setProfileImage] = useState(null); // Base64 with data: URI prefix
  const [cv, setCV] = useState(null); // Base64 with data: URI prefix
  const [cvName, setCVName] = useState('');
  
  // New courses state management
  const [courseInput, setCourseInput] = useState('');
  const [courses, setCourses] = useState([]); // List of courses as an array

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.4,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const uri = asset.uri;
      const base64 = asset.base64;

      const info = await FileSystem.getInfoAsync(uri, { size: true });
      const sizeInMB = info.size / (1024 * 1024);

      if (sizeInMB > 2) {
        Alert.alert('File too large', 'Please choose an image under 2MB.');
        return;
      }

      let mimeType = 'image/jpeg';
      if (uri.endsWith('.png')) mimeType = 'image/png';
      else if (uri.endsWith('.jpg') || uri.endsWith('.jpeg')) mimeType = 'image/jpeg';
      else if (uri.endsWith('.webp')) mimeType = 'image/webp';

      setProfileImage(`data:${mimeType};base64,${base64}`);
    }
  };

  const pickCV = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ],
      });
  
      console.log('Document Picker Result:', result);
  
      // Check if the user selected a file
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];  // File information is inside assets array
  
        // Check file size
        const fileInfo = await FileSystem.getInfoAsync(file.uri);
        const fileSizeInMB = fileInfo.size / (1024 * 1024); // Convert size to MB
        console.log('File Size in MB:', fileSizeInMB);
  
        if (fileSizeInMB > 10) {
          Alert.alert('File too large', 'Please select a file smaller than 10MB.');
          return;
        }
  
        let mimeType = file.mimeType || '';
        const fileName = file.name.toLowerCase();
        
        // Check the file extension and set MIME type accordingly
        if (fileName.endsWith('.pdf')) {
          mimeType = 'application/pdf';
        } else if (fileName.endsWith('.doc')) {
          mimeType = 'application/msword';
        } else if (fileName.endsWith('.docx')) {
          mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        } else {
          Alert.alert('Invalid file', 'Please select a PDF, DOC, or DOCX file.');
          return;
        }
  
        const fileBase64 = await FileSystem.readAsStringAsync(file.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
  
        setCV(`data:${mimeType};base64,${fileBase64}`);
        setCVName(file.name);
        console.log('CV Selected:', file.uri);
      } else {
        console.log('File picker was canceled.');
      }
    } catch (err) {
      Alert.alert('Error', 'Could not select file.');
      console.error('Error selecting file:', err);
    }
  };
  

  // Handler for adding courses
  const addCourse = () => {
    if (courseInput.trim() !== '') {
      setCourses(prev => [...prev, courseInput.trim()]);
      setCourseInput('');
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('phone', phone);
      formData.append('designation', designation);
      formData.append('about', about);
      formData.append('address', address);
      if (profileImage) formData.append('profileImage', profileImage);
      if (cv) formData.append('cv', cv);
      // Append courses as a JSON string
      formData.append('courses', JSON.stringify(courses));

      const response = await fetch('https://catchup-project.onrender.com/api/teacher-reviews/create', {
        method: 'POST',
        body: formData,
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error('Non-JSON response:', text);
        throw new Error('Invalid response from server');
      }

      if (response.ok) {
        Alert.alert('Success', 'Teacher profile created!');
        router.push({
          pathname: 'teachers/success',
          params: { email },
        });
      } else {
        Alert.alert('Error', data.error || 'Something went wrong!');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong!');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar translucent backgroundColor="#000" barStyle="light-content" />

      <TouchableOpacity onPress={() => router.back()} style={styles.goBack}>
        <Text style={styles.goBackText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Add Teacher</Text>

      <Input label="Name" icon="person" value={name} onChangeText={setName} />
      <Input label="Email" icon="mail" value={email} onChangeText={setEmail} />
      <Input
        label="Password"
        icon="lock-closed"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Input label="Phone" icon="call" value={phone} onChangeText={setPhone} />
      <Input label="Designation" icon="briefcase" value={designation} onChangeText={setDesignation} />
      <Input label="About" icon="information-circle" value={about} onChangeText={setAbout} />
      <Input label="Address" icon="home" value={address} onChangeText={setAddress} />

      {/* Course Input Section */}
      <View style={styles.courseContainer}>
        <Text style={styles.label}>Courses</Text>
        <View style={styles.courseInputRow}>
          <TextInput
            style={styles.courseInput}
            placeholder="Enter course name"
            value={courseInput}
            onChangeText={setCourseInput}
          />
          <TouchableOpacity onPress={addCourse} style={styles.addCourseButton}>
            <Ionicons name="add-circle" size={54} color="#007aff" />
          </TouchableOpacity>
        </View>
        {courses.length > 0 && (
          <View style={styles.courseList}>
            {courses.map((course, index) => (
              <Text key={index} style={styles.courseItem}>
                {course}
              </Text>
            ))}
          </View>
        )}
      </View>

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
        <TouchableOpacity
          onPress={() =>
            Alert.alert('File Selected', `${cvName || 'CV'} is ready to upload.`)
          }
        >
          <Text style={styles.link}>📄 {cvName || 'View Selected CV'}</Text>
        </TouchableOpacity>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#007aff" />
      ) : (
        <Button title="Submit" onPress={handleSubmit} />
      )}
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
  courseContainer: {
    marginBottom:10,
    marginTop:10,
  },
  courseInput: {
    height: 45, // Make the input taller for a more traditional input feel
    fontSize: 16, // Increase font size for readability
    borderWidth: 1, // Add a border to the input
    borderColor: '#ccc', // Light gray color for the border
    borderRadius: 8, // Rounded corners
    paddingHorizontal: 15, // Padding inside the input to avoid text being too close to edges
    paddingVertical: 10, // Add some vertical padding for a better height feel
    backgroundColor: '#fff', // White background to make it stand out
    marginBottom: 10, // Space between the input and other elements
    elevation: 2, // Adds a slight shadow to make it appear raised (Android only)
    shadowColor: '#000', // Adds shadow effect for iOS
    shadowOffset: { width: 0, height: 2 }, // Slightly off-center shadow
    shadowOpacity: 0.1, // Light shadow opacity for a soft effect
    shadowRadius: 4, // Shadow radius to make the shadow a little spread out
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
