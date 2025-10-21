Feature: Ticket booking

   Scenario: Successful ticket booking for the film Stalker
    Given user is on "/client/hall.php" page
    When user books a ticket for the movie Stalker
    Then user should see the general confirmation "Покажите QR-код нашему контроллеру для подтверждения бронирования"

    
   Scenario: Successfully booked tickets for the film "The Witcher"
    Given user is on "/client/hall.php" page
    When user books a VIP ticket for the movie Witcher
    Then user should see the special confirmation "Покажите QR-код нашему контроллеру для подтверждения бронирования"

   Scenario: The book button is not activer
    Given user is on "/client/hall.php" page
    When user clicks the "Book" button without selecting a seat
    Then user sees that the button is inactive

