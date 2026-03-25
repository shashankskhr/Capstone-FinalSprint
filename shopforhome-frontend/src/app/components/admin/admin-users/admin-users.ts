import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user';

@Component({
  selector: 'app-admin-users',
  standalone: false,
  templateUrl: './admin-users.html'
})
export class AdminUsersComponent implements OnInit {
  users: any[] = [];
  form: any = { fullName: '', email: '', password: '', role: 'User' };
  editMode = false;
  editId: number | null = null;
  message = '';

  constructor(private userService: UserService) {}

  ngOnInit() { this.loadUsers(); }

  loadUsers() {
    this.userService.getUsers().subscribe(u => this.users = u);
  }

  save() {
    if (this.editMode && this.editId) {
      this.userService.updateUser(this.editId, this.form).subscribe(() => {
        this.message = 'User updated.'; this.reset(); this.loadUsers();
      });
    } else {
      this.userService.createUser(this.form).subscribe(() => {
        this.message = 'User created.'; this.reset(); this.loadUsers();
      });
    }
  }

  edit(u: any) {
    this.editMode = true; this.editId = u.userId;
    this.form = { fullName: u.fullName, email: u.email, password: '', role: u.role };
  }

  delete(id: number) {
    if (confirm('Delete user?')) {
      this.userService.deleteUser(id).subscribe(() => this.loadUsers());
    }
  }

  reset() {
    this.form = { fullName: '', email: '', password: '', role: 'User' };
    this.editMode = false; this.editId = null;
  }
}