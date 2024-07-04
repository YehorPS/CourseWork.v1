document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const militaryForm = document.getElementById('militaryForm');
    const militaryTable = document.getElementById('militaryTable')?.getElementsByTagName('tbody')[0];

    let token = localStorage.getItem('token');

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;

            const res = await fetch('/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await res.json();
            if (data._id) {
                window.location.href = 'login.html';
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            const res = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            if (data.token) {
                localStorage.setItem('token', data.token);
                window.location.href = 'military.html';
            } else {
                console.log(data);
            }
        });
    }

    if (militaryForm) {
        militaryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('militaryName').value;
            const rank = document.getElementById('militaryRank').value;
            const salary = document.getElementById('militarySalary').value;
            const dateEnlisted = document.getElementById('militaryDateEnlisted').value;

            try {
                const res = await fetch('/api/military/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    },
                    body: JSON.stringify({ name, rank, salary, dateEnlisted })
                });

                const data = await res.json();
                if (res.ok) {
                    addMilitaryRow(data);
                } else {
                    console.error('Error adding military:', data);
                }
            } catch (error) {
                console.error('Network error:', error);
            }
        });

        async function loadMilitaries() {
            try {
                const res = await fetch('/api/military/list', {
                    headers: {
                        'Authorization': token
                    }
                });

                const militaries = await res.json();
                militaryTable.innerHTML = '';
                militaries.forEach(military => addMilitaryRow(military));
            } catch (error) {
                console.error('Error loading militaries:', error);
            }
        }

        function addMilitaryRow(military) {
            const row = militaryTable.insertRow();
            const nameCell = row.insertCell(0);
            const rankCell = row.insertCell(1);
            const salaryCell = row.insertCell(2);
            const dateEnlistedCell = row.insertCell(3);

            nameCell.textContent = military.name;
            rankCell.textContent = military.rank;
            salaryCell.textContent = military.salary;
            dateEnlistedCell.textContent = new Date(military.dateEnlisted).toDateString();
        }

        loadMilitaries();
    }
});