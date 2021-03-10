import React from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  View
} from "react-native";

import { TextField, ErrorText } from "../components/Form";
import { Button } from "../components/Button";
import { reviewApi } from "../util/api";

const styles = StyleSheet.create({
  textBlock: {
    marginTop: 20
  },
  text: {
    fontSize: 18,
    color: "#969696",
    textAlign: "center",
    marginBottom: 2
  },
  link: {
    textDecorationLine: "underline"
  },
});

class CreateAccount extends React.Component {
  state = {
    email: null,
    firstName: null,
    lastName: null,
    password: null,
    confirmpassword: null,
    errorText: null,
    loading: false,
    error: '',
  }

  // checkPassword = () => {

  //   const { password, confirmpassword } = this.state
  //   if (password === confirmpassword) {
  //     this.onSubmitPress();
  //   } else {
  //     console.log('passwords are not equal', error);
  //     this.setState({ errorText: "Your passwords are not the same", loading: false });
  //   }
  // }

  validatePassword = () => {
    let isValid = true;
    const { password, confirmpassword } = this.state
    if (password != confirmpassword) {
      isValid = false;
    } else {
      isValid = true;
    }

    return isValid;
  }

  onSubmitPress = () => {
    const { email, firstName, lastName, password } = this.state

    if (this.validatePassword()) {
      this.setState({ loading: true }, () => {
        reviewApi(`/createaccount`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, firstName, lastName, password }),
        })
          .then(() => {
            //this.props.navigation.popToTop();
            this.props.navigation.navigate("SignIn");
          })
          .catch(error => {
            console.log('create user error', error);
          })
          .finally(() => {
            this.props.navigation.navigate("SignIn");
            this.setState({ loading: false });
            console.log('user created');
          });
      });
    } else {
      this.setState({ loading: false, errorText: "Passwords do not match" });
    }
  };


  render() {
    return (
      <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
        <TextField
          label="Email"
          placeholder="john.doe@example.com"
          value={this.state.email}
          onChangeText={email => this.setState({ email })}
          autoCapitalize="none"
        />
        <TextField
          label="First Name"
          placeholder="John"
          value={this.state.firstName}
          onChangeText={firstName => this.setState({ firstName })}
          autoCapitalize="none"
        />
        <TextField
          label="Last Name"
          placeholder="Doe"
          value={this.state.lastName}
          onChangeText={lastName => this.setState({ lastName })}
          autoCapitalize="none"
        />
        <TextField
          label="Password"
          secureTextEntry
          value={this.state.password}
          onChangeText={password => this.setState({ password })}
          autoCapitalize="none"
        />
        <TextField
          label="Confirm Password"
          secureTextEntry
          value={this.state.confirmpassword}
          onChangeText={confirmpassword => this.setState({ confirmpassword })}
          autoCapitalize="none"
        />
        <ErrorText text={this.state.errorText} />
        <Button text="Submit"
          onPress={this.onSubmitPress}
          loading={this.state.loading}
          value={this.state.errorText}
          onChangeText={errorText => this.setState({ errorText })}
        />
        <View style={styles.textBlock}>
          <Text style={styles.text}>Already have an account?</Text>
          <TouchableOpacity onPress={() => this.props.navigation.navigate("SignIn")}>
            <Text style={[styles.text, styles.link]}>Sign in.</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

export default CreateAccount;


