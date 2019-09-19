import React, { Component } from 'react'
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView
} from 'react-native'
import { connect } from 'react-redux'
import { attendEvent, unattendEvent, deleteEvent } from '../src/actions/events'
import Comments from '../components/Comments'
import Modal from 'react-native-modal'


interface Props {
  user: UserLimited
  username: string
  showEvent: boolean
  setUserName: Function
  closeEvent: Function
  getEvents: Function
  showEditEventForm: Function
  currentEvent: Event
  attendEvent: Function
  unattendEvent: Function
  deleteEvent: Function
}

interface UserLimited {
  first_name: string
  email: string
  profile_photo: string
}

interface Comment {
  id: string
  content: string
  timestamp: Date
  from: UserLimited
}

interface Event {
  name: string
  id: number
  cover_photo: string
  description: string
  location: string
  attendees: Array<UserLimited>
  creator: UserLimited
  comments: Array<Comment>
}


const EventModal: React.FunctionComponent<Props> = (props) => {

    let rsvpButton

    if (
      props.currentEvent.attendees &&
      props.currentEvent.attendees
        .map(attendees => attendees.email)
        .includes(props.user.email)
    ) {
      rsvpButton = (
        <TouchableOpacity
          onPress={() =>
            props.unattendEvent(
              props.currentEvent.id,
              props.user.email
            )
          }
          style={styles.event__button}
        >
          <Text style={styles.button__text}>Unattend</Text>
        </TouchableOpacity>
      )
    } else {
      rsvpButton = (
        <TouchableOpacity
          onPress={() =>
            props.attendEvent(props.currentEvent.id, props.user)
          }
          style={styles.event__button}
        >
          <Text style={styles.button__text}>RSVP</Text>
        </TouchableOpacity>
      )
    }

    let editButton
    let deleteButton
    if (
      props.currentEvent.creator &&
      props.user.email === props.currentEvent.creator.email
    ) {
      editButton = (
        <TouchableOpacity
          style={styles.event__button} 
          onPress={() => props.showEditEventForm()}
        >
          <Text style={styles.button__text}>Edit Event</Text>
        </TouchableOpacity>
      )
      deleteButton = (
        <TouchableOpacity
          style={styles.event__button}
          onPress={() => props.deleteEvent(props.currentEvent.id)}
        >
          <Text style={styles.button__text}>Delete Event</Text>
        </TouchableOpacity>
      )
      }
    return (
      <>
      <Modal
        isVisible={props.showEvent}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropOpacity={1}
        style={styles.modal}
        backdropColor="#e5e6e5"
        >
        {/* <View style={styles.contentContainer}> */}
          <ScrollView style={styles.scrollView}>
            <Text style={styles.back} onPress={() => props.closeEvent()}>
              {'<'}
            </Text>
            <View style={styles.image__container}>
              <Image
                source={{ uri: props.currentEvent.cover_photo }}
                style={styles.animated__photo}
              />
            </View>
            <View style={styles.text__block}>
              <Text style={styles.event__title}>
                {props.currentEvent.name}
              </Text>
              <Text style={styles.event__subtitle}>Summary</Text>
              <Text style={styles.event__text}>
                {props.currentEvent.description}
              </Text>
              <Text style={styles.event__subtitle}>Location</Text>
              <Text style={styles.event__text}>
                {props.currentEvent.location}
              </Text>
            </View>
            <View style={styles.button__block}>
              {/* commenting this out for now until we decide to add some functionality
              <TouchableOpacity style={styles.event__button}>
                <Text style={styles.button__text}>Attendees</Text>
              </TouchableOpacity> */}
              {rsvpButton}
              {editButton}
              {deleteButton}
            </View>
            <View>
              <View style={styles.comments_header}>
                <Text style={styles.event__subtitle}>Comments</Text>
              </View>
              <View>
                <Comments comments={props.currentEvent.comments} />
              </View>
            </View>
          </ScrollView>
        {/* </View> */}
      </Modal>
      </>
    )
  }


const styles = StyleSheet.create({

  back: { 
    marginTop: 25, 
    marginBottom: 25, 
    marginLeft: 10, 
    fontSize: 20 
  },
  contentContainer: {
    position: 'absolute',
    backgroundColor: '#fff'
  },
  image__container: {
    width: '100%',
    height: 320
  },
  animated__photo: {
    flex: 1,
    width: undefined,
    height: undefined,
    borderRadius: 5
  },
  scrollView: {
    marginTop: 20
  },
  event__text: {
    alignSelf: 'center',
    marginTop: 5,
    fontSize: 16
  },
  event__title: {
    fontSize: 24,
    alignSelf: 'center',
    fontWeight: '800'
  },
  comments_header: {
    marginTop: 20,
    alignSelf: 'center',
  },
  event__subtitle: {
    marginTop: 20,
    fontSize: 18,
    alignSelf: 'center',
    fontWeight: '700'
  },
  text__block: {
    backgroundColor: '#e5e6e5',
    padding: 30,
    borderRadius: 5
  },
  button__block: {
    paddingBottom: 15,
    borderRadius: 5
  },
  event__button: {
    alignItems: 'center',
    alignSelf: 'center',
    width: '50%',
    backgroundColor: '#73d961',
    padding: 15,
    borderRadius: 50,
    marginTop: 15
  },
  button__text: {
    fontWeight: '800',
    color: 'white'
  }
})

const mapStateToProps = state => {
  return {
    showEvent: state.showEvent,
    currentEvent: state.currentEvent,
    user: state.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
    closeEvent: () => {
      dispatch({
        type: 'CLOSE_EVENT'
      })
    },
    showEditEventForm: () => {
      dispatch({
        type: 'SHOW_EDIT_EVENT_FORM'
      })
    },
    attendEvent: (eventId, user) => dispatch(attendEvent(eventId, user)),
    unattendEvent: (eventId, userEmail) =>
      dispatch(unattendEvent(eventId, userEmail)),
    deleteEvent: eventId => dispatch(deleteEvent(eventId))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventModal)